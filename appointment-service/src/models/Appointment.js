const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  agentUserId: {
    type: String,
    default: null,
  },
  appointmentType: {
    type: String,
    enum: ['site_visit', 'document_review', 'negotiation_meeting', 'notary_appointment'],
    required: [true, 'Appointment type is required'],
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
  },
  location: {
    type: String,
    required: [true, 'Meeting location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters'],
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: null,
  },
  cancellationReason: {
    type: String,
    maxlength: [300, 'Cancellation reason cannot exceed 300 characters'],
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
