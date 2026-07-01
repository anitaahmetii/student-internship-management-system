const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  industry: { type: String },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  address: { type: String },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  website: { type: String },
  logoUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;