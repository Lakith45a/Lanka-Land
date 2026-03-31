const Document = require('../models/Document');
const { validationResult } = require('express-validator');

exports.getAllDocuments = async (req, res) => {
  try {
    const { propertyId, documentType, verificationStatus, uploadedByUserId, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (propertyId) filter.propertyId = propertyId;
    if (documentType) filter.documentType = documentType;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (uploadedByUserId) filter.uploadedByUserId = uploadedByUserId;

    const documents = await Document.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Document.countDocuments(filter);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, data: document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const document = await Document.create(req.body);
    res.status(201).json({ success: true, message: 'Document registered successfully', data: document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, message: 'Document updated', data: document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyDocument = async (req, res) => {
  try {
    const { verificationStatus, verifiedByUserId, verificationNotes } = req.body;
    const validStatuses = ['pending', 'verified', 'rejected', 'requires_update'];
    if (!validStatuses.includes(verificationStatus)) return res.status(400).json({ success: false, message: 'Invalid verification status' });

    const update = { verificationStatus };
    if (verifiedByUserId) update.verifiedByUserId = verifiedByUserId;
    if (verificationNotes) update.verificationNotes = verificationNotes;

    const document = await Document.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, message: 'Document verification status updated', data: document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDocumentsByProperty = async (req, res) => {
  try {
    const documents = await Document.find({ propertyId: req.params.propertyId });
    res.json({ success: true, total: documents.length, data: documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
