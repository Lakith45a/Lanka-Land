const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  propertyType: {
    type: String,
    enum: ['bare-land', 'agricultural', 'residential', 'commercial', 'industrial'],
    required: [true, 'Property type is required'],
  },
  extentPerches: {
    type: Number,
    required: [true, 'Extent in perches is required'],
    min: [1, 'Extent must be at least 1 perch'],
  },
  pricePerPerch: {
    type: Number,
    required: [true, 'Price per perch is required'],
    min: [0, 'Price cannot be negative'],
  },
  totalPriceLKR: {
    type: Number,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    enum: [
      'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
      'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
      'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
      'Moneragala', 'Ratnapura', 'Kegalle'
    ],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  sellerUserId: {
    type: String,
    required: [true, 'Seller user ID is required'],
  },
  status: {
    type: String,
    enum: ['available', 'under_negotiation', 'sold', 'withdrawn'],
    default: 'available',
  },
  amenities: {
    roadAccess: { type: Boolean, default: false },
    electricityAvailable: { type: Boolean, default: false },
    waterAvailable: { type: Boolean, default: false },
    deedClear: { type: Boolean, default: false },
  },
  imageUrls: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-calculate total price
propertySchema.pre('save', function (next) {
  this.totalPriceLKR = this.extentPerches * this.pricePerPerch;
  next();
});

module.exports = mongoose.model('Property', propertySchema);
