const Valuation = require('../models/Valuation');
const { validationResult } = require('express-validator');

exports.getAllValuations = async (req, res) => {
  try {
    const { status, propertyId, district, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;
    if (district) filter.district = district;

    const valuations = await Valuation.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Valuation.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: valuations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getValuationById = async (req, res) => {
  try {
    const valuation = await Valuation.findById(req.params.id);
    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found' });
    res.json({ success: true, data: valuation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createValuation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const valuation = await Valuation.create(req.body);
    res.status(201).json({ success: true, message: 'Valuation request submitted', data: valuation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateValuation = async (req, res) => {
  try {
    const valuation = await Valuation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found' });
    res.json({ success: true, message: 'Valuation updated', data: valuation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeValuation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { estimatedValueLKR, valuePerPerchLKR, valuatorName, valuatorLicenseNo, remarks } = req.body;
    const update = {
      status: 'completed',
      estimatedValueLKR,
      valuePerPerchLKR,
      valuationDate: new Date(),
    };
    if (valuatorName) update.valuatorName = valuatorName;
    if (valuatorLicenseNo) update.valuatorLicenseNo = valuatorLicenseNo;
    if (remarks) update.remarks = remarks;

    const valuation = await Valuation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found' });
    res.json({ success: true, message: 'Valuation completed', data: valuation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteValuation = async (req, res) => {
  try {
    const valuation = await Valuation.findByIdAndDelete(req.params.id);
    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found' });
    res.json({ success: true, message: 'Valuation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
