const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    job_category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCategory",
      },
    ],
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    company_name: {
      type: String,
      required: false,
    },
    is_recruiter: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    daily_wage: {
      type: Number,
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
