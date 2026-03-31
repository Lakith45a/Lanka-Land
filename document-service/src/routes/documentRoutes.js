const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/documentController');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Legal document management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentInput:
 *       type: object
 *       required: [propertyId, uploadedByUserId, documentType, documentTitle, fileUrl]
 *       properties:
 *         propertyId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         uploadedByUserId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         documentType:
 *           type: string
 *           enum: [title_deed, survey_plan, notarial_deed, valuation_report, tax_clearance, land_registry_extract, cadastral_map, other]
 *           example: title_deed
 *         documentTitle:
 *           type: string
 *           example: Original Title Deed - Lot 12, Colombo 07
 *         fileUrl:
 *           type: string
 *           example: "https://storage.example.com/docs/title_deed_lot12.pdf"
 *         isPublic:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *       - in: query
 *         name: verificationStatus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 */
router.get('/', ctrl.getAllDocuments);

/**
 * @swagger
 * /api/documents/property/{propertyId}:
 *   get:
 *     summary: Get all documents for a property
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documents for property
 */
router.get('/property/:propertyId', ctrl.getDocumentsByProperty);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document found
 *       404:
 *         description: Document not found
 */
router.get('/:id', ctrl.getDocumentById);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Register a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       201:
 *         description: Document registered
 */
router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('uploadedByUserId').notEmpty().withMessage('Uploader user ID is required'),
    body('documentType').isIn(['title_deed', 'survey_plan', 'notarial_deed', 'valuation_report', 'tax_clearance', 'land_registry_extract', 'cadastral_map', 'other']).withMessage('Invalid document type'),
    body('documentTitle').trim().notEmpty().withMessage('Document title is required'),
    body('fileUrl').notEmpty().withMessage('File URL is required'),
  ],
  ctrl.createDocument
);

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       200:
 *         description: Document updated
 */
router.put('/:id', ctrl.updateDocument);

/**
 * @swagger
 * /api/documents/{id}/verify:
 *   patch:
 *     summary: Update document verification status
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationStatus]
 *             properties:
 *               verificationStatus:
 *                 type: string
 *                 enum: [pending, verified, rejected, requires_update]
 *               verifiedByUserId:
 *                 type: string
 *               verificationNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification status updated
 */
router.patch('/:id/verify', ctrl.verifyDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted
 */
router.delete('/:id', ctrl.deleteDocument);

module.exports = router;
