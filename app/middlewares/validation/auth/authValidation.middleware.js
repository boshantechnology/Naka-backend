const { body, validationResult } = require("express-validator");

exports.validateUserNumber = [
  body("phoneNumber")
    .notEmpty()
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateOtpVerification = [
  body("otp").notEmpty().withMessage("Valid OTP is required"),
  body("phoneNumber")
    .notEmpty()
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateToken = [
  body("refreshToken").notEmpty().withMessage("Valid Token is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateWorkerProfileSetup = [
  body("email").optional().isEmail().withMessage("Valid email is required"),

  body("name").optional().isString().withMessage("Valid name is required"),

  body("age").optional().isNumeric().withMessage("Valid age is required"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female or Other"),

  body("address")
    .optional()
    .isString()
    .withMessage("Valid address is required"),

  body("bio").optional().isString().withMessage("Valid bio is required"),

  body("designation")
    .optional()
    .isString()
    .withMessage("Valid designation is required"),

  body("is_recruiter")
    .optional()
    .isBoolean()
    .withMessage("Valid is_recruiter status is required"),

  body("experience")
    .optional()
    .isString()
    .withMessage("Valid experience is required"),

  body("daily_wage")
    .optional()
    .isNumeric()
    .withMessage("Valid daily wage is required"),

  body("job_category_id")
    .optional()
    .isArray()
    .withMessage("Job categories must be an array of IDs"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateRecruiterProfileSetup = [
  body("email").optional().isEmail().withMessage("Valid email is required"),

  body("name").optional().isString().withMessage("Valid name is required"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female or Other"),

  body("company_name")
    .optional()
    .isString()
    .withMessage("Valid company name is required"),

  body("website")
    .optional()
    .isURL()
    .withMessage("Valid website URL is required"),

  body("bio").optional().isString().withMessage("Valid bio is required"),

  body("address")
    .optional()
    .isString()
    .withMessage("Valid address is required"),

  body("is_recruiter")
    .optional()
    .isBoolean()
    .withMessage("Valid is_recruiter status is required"),

  body("job_category_id")
    .optional()
    .isArray()
    .withMessage("Job categories must be an array of IDs"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
