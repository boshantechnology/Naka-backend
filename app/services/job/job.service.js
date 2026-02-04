const User = require("../../models/user.model");
const Job = require("../../models/job/job.model");
const JobApplication = require("../../models/job/jobApplication.model");
const JobCategory = require("../../models/category/category.model");
const mongoose = require("mongoose");

exports.createJobPost = async (req) => {
  const user_id = req.user._id;
  const user = await User.findById(user_id); // ensure recruiter permissions if needed

  if (!user) throw new Error("Recruiter (User) not found");
  // Optional: check if user.role === 'recruiter' or 'user' (as per schema)

  const {
    title,
    description,
    job_category_id,
    experience_required,
    salary_amount,
    salary_type,
    vacancy_start_date,
    vacancy_end_date,
    total_required_workers,
    benefits,
    location, // Should be { type: 'Point', coordinates: [long, lat], address: '...' } or simplified input
    // Legacy mapping if needed
    employment_type,
    work_mode,
    company_name,
    skill_required,
    deadline
  } = req.body;

  // Ensure location is properly formatted for GeoJSON
  let geoLocation = location;
  if (req.body.latitude && req.body.longitude) {
    geoLocation = {
      type: 'Point',
      coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      address: req.body.address || ''
    };
  }

  const job_data = {
    user_id,
    title,
    description,
    job_category_id,
    experience_required,
    salary_amount,
    salary_type,
    vacancy_start_date,
    vacancy_end_date,
    total_required_workers,
    benefits,
    location: geoLocation,

    // Mapped or direct fields
    employment_type,
    work_mode,
    company_name: company_name || user.company_name || user.name,
    skill_required,
    deadline,

    recruiter_name: user.name,
    recruiter_email: user.email,
    recruiter_phone: user.phone_number
  };

  // Auto-create category if doesn't exist and admin logic is different (but requirements say create if not exist pending approval)
  // For now assuming category ID is passed from selection

  return await Job.create(job_data);
};

exports.getJobDetail = async (job_id, current_user_id) => {
  const job = await Job.findById(job_id)
    .populate("user_id", "name email phone_number company_name")
    .populate("job_category_id", "name")
    .lean();

  if (!job) throw new Error("Job not found");

  if (current_user_id) {
    // If not owner, inc view
    if (job.user_id && job.user_id._id.toString() !== current_user_id.toString()) {
      await Job.findByIdAndUpdate(job_id, { $inc: { views: 1, click_count: 1 } });
    }

    const application = await JobApplication.findOne({
      job_id: job_id,
      worker_id: current_user_id
    }).lean();
    job.has_applied = !!application;
  }

  return job;
};

exports.getJobList = async ({
  search,
  tags,
  userLocation, // { latitude, longitude }
  radiusInKm,
  page = 1,
  limit = 10,
  // New filters
  salary_min,
  category_id,
  experience
}) => {
  let pipeline = [];

  // 1. GeoNear Search (Must be first in pipeline)
  if (userLocation?.longitude && userLocation?.latitude) {
    const geoNearStage = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(userLocation.longitude), parseFloat(userLocation.latitude)],
        },
        distanceField: "distance",
        spherical: true,
        // distanceMultiplier: 0.001, // to convert meters to km if needed
      },
    };

    if (radiusInKm && radiusInKm !== "all") {
      geoNearStage.$geoNear.maxDistance = parseFloat(radiusInKm) * 1000;
    }

    pipeline.push(geoNearStage);
  }

  // 2. Match Filters
  let matchQuery = { is_active: true };

  if (search) {
    matchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { company_name: { $regex: search, $options: "i" } }
    ];
  }

  if (category_id) {
    matchQuery.job_category_id = mongoose.Types.ObjectId(category_id);
  }

  if (experience) {
    matchQuery.experience_required = { $regex: experience, $options: 'i' };
  }

  if (salary_min) {
    matchQuery.salary_amount = { $gte: parseFloat(salary_min) };
  }

  pipeline.push({ $match: matchQuery });

  // 3. Populate Category (lookup)
  pipeline.push({
    $lookup: {
      from: "jobcategories",
      localField: "job_category_id",
      foreignField: "_id",
      as: "category"
    }
  });
  pipeline.push({ $unwind: { path: "$category", preserveNullAndEmptyArrays: true } });

  // 4. Sort (Nearest first if geo used, otherwise date)
  if (!userLocation?.longitude) {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // 5. Pagination
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: (page - 1) * limit }, { $limit: parseInt(limit) }]
    }
  });

  const result = await Job.aggregate(pipeline);
  const data = result[0].data || [];
  const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

  return {
    jobs: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit
    }
  };
};

// ... keep existing getMyJobPosts (update query), applyJob, category methods ...
exports.getMyJobPosts = async (user_id, page = 1, limit = 10) => {
  // Update to use user_id not is_deleted check only
  const jobs = await Job.find({ user_id: user_id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
  const total = await Job.countDocuments({ user_id: user_id });

  // Fetch views/applicants stats
  // ... returning simple list for now
  return {
    jobs,
    pagination: { currentPage: page, totalItems: total, totalPages: Math.ceil(total / limit), limit }
  };
};

exports.applyJob = async (job_id, user) => {
  const job = await Job.findById(job_id);
  if (!job) throw new Error("Job not found");

  if (String(job.user_id) === String(user._id)) {
    throw new Error("Cannot apply to your own job");
  }

  // Check if worker profile exists (if required)
  // if (!user.worker_profile) throw new Error("Incomplete worker profile");

  const existingApp = await JobApplication.findOne({ job_id, worker_id: user._id });
  if (existingApp) throw new Error("Already applied");

  const application = await JobApplication.create({
    job_id,
    worker_id: user._id,
    status: 'applied'
  });

  // Update applicants count
  job.applicants_count += 1;
  await job.save();

  return application;
};

// Category services (kept mostly same)
exports.createJobCategory = async (data) => {
  return await JobCategory.create(data);
};

exports.getJobCategories = async (limit = 100, page = 1) => {
  return await JobCategory.find({ is_deleted: false }); // simplified
};

exports.deleteJobCategory = async (id) => {
  await JobCategory.findByIdAndUpdate(id, { is_deleted: true });
};

exports.updateJobCategory = async (id, data) => {
  return await JobCategory.findByIdAndUpdate(id, data, { new: true });
};

exports.getRecommendedJobs = async (userId, page = 1, limit = 10) => {
  // Simple recommendation: Based on user's job_category_id or interest
  // For now, return latest jobs
  return await this.getJobList({ page, limit });
};
