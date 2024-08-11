// models/Brand.js
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  approved: { type: Boolean, default: false },
});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);


