const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Common Auth Fields
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    email: { // Optional for worker, required for user? Let's make it optional but unique if present
      type: String,
      unique: true,
      sparse: true
    },
    password: { // For JWT auth
      type: String,
      required: false, // If using OTP only initially, but usually required. Let's assume OTP/Password hybrid or just set it.
    },
    role: {
      type: String,
      enum: ["user", "admin", "worker", "support"],
      default: "user",
      required: true
    },
    is_blocked: {
      type: Boolean,
      default: false
    },

    // LOCATION (GeoJSON) - Common for both to sort jobs/workers
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      },
      address: {
        type: String
      }
    },

    // WORKER SPECIFIC FIELDS
    worker_profile: {
      work_type: { type: String }, // e.g., Plumber, Helper
      expected_income: { type: Number },
      experience: { type: String }, // e.g., "2 years"
      // location is at root
    },

    // USER (Recruiter) SPECIFIC FIELDS
    user_profile: {
      aadhar_number: { type: String },
      photo: { type: String },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      age: { type: Number },
      // location is at root
    },

    // Legacy/Generic fields to keep minimal compatibility if needed, but per requirements we focus on the above.
    profile_image: {
      type: String,
    }
  },
  { timestamps: true }
);

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("User", userSchema);
