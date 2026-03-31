const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: [true, 'Property ID is required'],
  },
  uploadedByUserId: {
    type: String,
    required: [true, 'Uploader user ID is required'],
  },
  documentType: {
    type: String,
    enum: [
      'title_deed',
      'survey_plan',
      'notarial_deed',
      'valuation_report',
      'tax_clearance',
      'land_registry_extract',
      'cadastral_map',
      'other'
    ],
    required: [true, 'Document type is required'],
  },
  documentTitle: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileSize: {
    type: Number,
    default: null,
  },
  mimeType: {
    type: String,
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'requires_update'],
    default: 'pending',
  },
  verifiedByUserId: {
    type: String,
    default: null,
  },
  verificationNotes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
