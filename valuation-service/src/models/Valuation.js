const mongoose = require('mongoose');

const valuationSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: [true, 'Property ID is required'],
  },
  requestedByUserId: {
    type: String,
    required: [true, 'Requester user ID is required'],
  },
  valuatorName: {
    type: String,
    trim: true,
    maxlength: [100, 'Valuator name cannot exceed 100 characters'],
    default: null,
  },
  valuatorLicenseNo: {
    type: String,
    trim: true,
    default: null,
  },
  valuationMethod: {
    type: String,
    enum: ['comparative_market', 'income_approach', 'cost_approach', 'residual_method'],
    default: 'comparative_market',
  },
  estimatedValueLKR: {
    type: Number,
    min: [0, 'Estimated value cannot be negative'],
    default: null,
  },
  valuePerPerchLKR: {
    type: Number,
    min: [0, 'Value per perch cannot be negative'],
    default: null,
  },
  extentPerches: {
    type: Number,
    required: [true, 'Extent in perches is required'],
    min: [1, 'Extent must be at least 1 perch'],
  },
  district: {
    type: String,
    required: [true, 'District is required'],
  },
  status: {
    type: String,
    enum: ['requested', 'in_progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  remarks: {
    type: String,
    maxlength: [1000, 'Remarks cannot exceed 1000 characters'],
    default: null,
  },
  valuationDate: {
    type: Date,
    default: null,
  },
  reportUrl: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Valuation', valuationSchema);
