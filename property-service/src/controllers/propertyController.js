const Property = require('../models/Property');
const { validationResult } = require('express-validator');

exports.getAllProperties = async (req, res) => {
  try {
    const { district, propertyType, status, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (district) filter.district = district;
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.totalPriceLKR = {};
      if (minPrice) filter.totalPriceLKR.$gte = Number(minPrice);
      if (maxPrice) filter.totalPriceLKR.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, message: 'Property listed successfully', data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property updated', data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'under_negotiation', 'sold', 'withdrawn'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property status updated', data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPropertiesBySeller = async (req, res) => {
  try {
    const properties = await Property.find({ sellerUserId: req.params.sellerId });
    res.json({ success: true, total: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
