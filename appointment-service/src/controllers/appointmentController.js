const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, propertyId, buyerUserId, sellerUserId, appointmentType, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;
    if (buyerUserId) filter.buyerUserId = buyerUserId;
    if (sellerUserId) filter.sellerUserId = sellerUserId;
    if (appointmentType) filter.appointmentType = appointmentType;

    const appointments = await Appointment.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ scheduledDate: 1 });

    const total = await Appointment.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, message: 'Appointment scheduled successfully', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment updated', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, cancellationReason, notes } = req.body;
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const update = { status };
    if (cancellationReason) update.cancellationReason = cancellationReason;
    if (notes) update.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment status updated', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
