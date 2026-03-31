const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: [true, 'Property ID is required'],
  },
  buyerUserId: {
    type: String,
    required: [true, 'Buyer user ID is required'],
  },
  sellerUserId: {
    type: String,
    required: [true, 'Seller user ID is required'],
  },
  inquiryType: {
    type: String,
    enum: ['general_question', 'purchase_offer', 'site_visit_request', 'price_negotiation'],
    required: [true, 'Inquiry type is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  offeredPriceLKR: {
    type: Number,
    min: [0, 'Offered price cannot be negative'],
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected', 'negotiating', 'closed'],
    default: 'pending',
  },
  agentNotes: {
    type: String,
    maxlength: [500, 'Agent notes cannot exceed 500 characters'],
    default: null,
  },
  contactPhone: {
    type: String,
    match: [/^(\+94|0)[0-9]{9}$/, 'Please provide a valid Sri Lankan phone number'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
