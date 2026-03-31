const Inquiry = require('../models/Inquiry');
const { validationResult } = require('express-validator');

exports.getAllInquiries = async (req, res) => {
  try {
    const { status, propertyId, buyerUserId, sellerUserId, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;
    if (buyerUserId) filter.buyerUserId = buyerUserId;
    if (sellerUserId) filter.sellerUserId = sellerUserId;

    const inquiries = await Inquiry.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Inquiry.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createInquiry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, agentNotes } = req.body;
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected', 'negotiating', 'closed'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const update = { status };
    if (agentNotes) update.agentNotes = agentNotes;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry status updated', data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
