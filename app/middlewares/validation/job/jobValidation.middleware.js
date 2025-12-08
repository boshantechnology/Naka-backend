const { body, validationResult, param } = require("express-validator");

exports.validateJob = [
  body("title")
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 3 })
    .withMessage("Job title must be at least 3 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),

  body("employment_type")
    .optional()
    .isIn([
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Temporary",
      "Freelance",
    ])
    .withMessage("Invalid employment type"),

  body("work_mode")
    .optional()
    .isIn(["On-site", "Remote", "Hybrid"])
    .withMessage("Invalid work mode"),

  body("company_name").notEmpty().withMessage("Company name is required"),

  body("location.city").notEmpty().withMessage("City is required"),

  body("location.state").notEmpty().withMessage("City is required"),

  body("location.country").notEmpty().withMessage("City is required"),

  body("location.pincode").notEmpty().withMessage("City is required"),

  body("location.lattitude").notEmpty().withMessage("Country is required"),

  body("location.longitude").notEmpty().withMessage("City is required"),

  body("salary_range.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary must be a number"),

  body("salary_range.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum salary must be a number"),

  body("salary_range.currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),

  body("salary_range.period")
    .optional()
    .isIn(["Monthly", "Yearly", "Hourly", "Daily"])
    .withMessage("Invalid salary period"),

  body("salary_range.negotiable")
    .optional()
    .isBoolean()
    .withMessage("Negotiable must be a boolean"),

  body("skill_required")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("education").optional().isString().withMessage("Invalid education"),

  body("experience_level")
    .optional()
    .isIn(["Fresher", "Junior", "Mid-level", "Senior", "Lead"])
    .withMessage("Invalid experience level"),

  body("recruiter_designation")
    .optional()
    .isString()
    .withMessage("Invalid recruiter designation"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Deadline must be a future date");
      }
      return true;
    }),

  body("job_category_id").notEmpty().withMessage("Job category ID is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateJobId = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid job id");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateJobApply = [
  body("job_id").notEmpty().withMessage("Job ID is required"),
];

exports.validateJobCategory = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateJobCategoryId = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid job category id");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
