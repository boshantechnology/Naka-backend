const User = require("../../models/user.model");
const Job = require("../../models/job/job.model");
const JobApplication = require("../../models/job/jobApplication.model");
const JobCategory = require("../../models/category/category.model");

exports.createJobPost = async (req) => {
  const user_id = req.user._id;
  const user = await User.findById(user_id);

  if (!user) throw new Error("Recruiter (User) not found");

  const {
    title,
    description,
    employment_type,
    work_mode,
    company_name,
    // company_logo,
    industry,
    website,
    location,
    salary_range,
    skill_required,
    experience_level,
    education,
    deadline,
    tags,
    recruiter_designation,
    job_category_id,
  } = req.body;

  const job_data = {
    user_id,
    title,
    description,
    employment_type,
    work_mode,
    company_name: company_name,
    // company_logo: company_logo || user.company_logo,
    industry: industry,
    website: website,
    location,
    salary_range,
    skill_required,
    experience_level,
    education,
    deadline,
    tags,
    recruiter_name: user.name,
    recruiter_designation: recruiter_designation || user.designation,
    recruiter_email: user.email,
    recruiter_phone: user.phone,
    job_category_id,
  };

  const job = await Job.create(job_data);

  return job;
};

exports.getJobDetail = async (job_id, current_user_id) => {
  const job = await Job.findById(job_id)
    .populate("user_id", "name email phone company_name")
    .lean();

  if (!job) throw new Error("Job not found");

  if (
    job.user_id &&
    job.user_id._id.toString() !== current_user_id.toString()
  ) {
    await Job.findByIdAndUpdate(job_id, { $inc: { views: 1 } });
  }

  const application = await JobApplication.findOne({
    job_id: mongoose.Types.ObjectId(job_id),
    user_id: mongoose.Types.ObjectId(current_user_id),
  }).lean();

  job.has_applied = application ? true : false;

  return job;
};

exports.getJobList = async ({
  search,
  tags,
  userLocation,
  radiusInKm,
  page = 1,
  limit = 10,
}) => {
  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { company_name: { $regex: search, $options: "i" } },
    ];
  }

  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }

  let pipeline = [];

  if (userLocation?.longitude && userLocation?.latitude) {
    const geoNearStage = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
        distanceField: "distance",
        spherical: true,
        distanceMultiplier: 0.001,
      },
    };

    if (radiusInKm && radiusInKm !== "all") {
      geoNearStage.$geoNear.maxDistance = radiusInKm * 1000;
    }

    pipeline.push(geoNearStage);
  }

  pipeline.push({ $match: query });

  pipeline.push({
    $lookup: {
      from: "jobapplications",
      let: { jobId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$job_id", "$$jobId"] },
                { $eq: ["$user_id", mongoose.Types.ObjectId(current_user_id)] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: "user_application",
    },
  });

  pipeline.push({
    $addFields: {
      has_applied: { $gt: [{ $size: "$user_application" }, 0] },
    },
  });

  pipeline.push({
    $sort: { createdAt: -1 },
  });

  pipeline.push({
    $project: {
      title: 1,
      company_name: 1,
      job_type: 1,
      tags: 1,
      salary: 1,
      experience: 1,
      location: 1,
      distance: 1,
      createdAt: 1,
      has_applied: 1,
    },
  });

  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  const jobs = await Job.aggregate(pipeline);

  return jobs;
};

exports.getMyJobPosts = async (user_id, page = 1, limit = 10) => {
  user_id = mongoose.Types.ObjectId(user_id);
  const totalItems = await Job.countDocuments({ user_id, is_deleted: false });
  const totalPages = Math.ceil(totalItems / limit);
  const jobs = await Job.find({ user_id, is_deleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  return {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
};

exports.applyJob = async (job_id, user) => {
  const job = await Job.findById(job_id);
  if (!job) throw new Error("Job not found");

  if (String(job.user_id) === String(user._id)) {
    return { success: false, message: "You cannot apply on your own job post" };
  }

  const alreadyApplied = await JobApplication.findOne({
    job_id,
    user_id: user._id,
  });

  if (alreadyApplied) {
    return { success: false, message: "You have already applied for this job" };
  }

  const application = await JobApplication.create({
    job_id,
    user_id: user._id,
  });

  return application;
};

// JOB CATEGORY SERVICES
exports.createJobCategory = async (data) => {
  const { name, description } = data;
  const category = await JobCategory.create({ name, description });
  return category;
};

exports.getJobCategories = async (limit, page) => {
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  const totalItems = await JobCategory.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);
  const categories = await JobCategory.find()
    .limit(limit)
    .skip((page - 1) * limit);
  return {
    categories,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
};

exports.deleteJobCategory = async (id) => {
  if (!(await JobCategory.findById(id))) {
    throw new Error("Job category not found");
  }
  await JobCategory.findByIdAndUpdate(id, { is_deleted: true });
  return;
};

exports.updateJobCategory = async (id, data) => {
  const { name, description } = data;
  const category = await JobCategory.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  return category;
};

exports.getRecommendedJobs = async (userId, page = 1, limit = 10) => {
  const user = await User.findById(userId).select("job_category_id");
  if (!user || !user.job_category_id || user.job_category_id.length === 0) {
    return {
      jobs: [],
      pagination: { currentPage: page, totalPages: 0, totalItems: 0, limit },
    };
  }

  const query = {
    job_category_id: { $in: user.job_category_id },
    is_deleted: { $ne: true },
  };
  const totalItems = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  return {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
};
