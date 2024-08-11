import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "brand",
  },
  brandInfo: {
    brandName: {
      type: String,
      trim: true,
    },
    brandDescription: {
      type: String,
      trim: true,
    },
    brandLogo: {
      type: String, // This could be a URL to the logo image
    },
    // You can add more fields as needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
