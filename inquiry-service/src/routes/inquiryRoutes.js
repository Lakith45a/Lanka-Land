const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/inquiryController');

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: Buyer inquiry management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InquiryInput:
 *       type: object
 *       required: [propertyId, buyerUserId, sellerUserId, inquiryType, message]
 *       properties:
 *         propertyId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         buyerUserId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         sellerUserId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *         inquiryType:
 *           type: string
 *           enum: [general_question, purchase_offer, site_visit_request, price_negotiation]
 *           example: purchase_offer
 *         message:
 *           type: string
 *           example: I am interested in purchasing this land. Is the price negotiable?
 *         offeredPriceLKR:
 *           type: number
 *           example: 25000000
 *         contactPhone:
 *           type: string
 *           example: "+94771234567"
 */

/**
 * @swagger
 * /api/inquiries:
 *   get:
 *     summary: Get all inquiries
 *     tags: [Inquiries]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: buyerUserId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of inquiries
 */
router.get('/', ctrl.getAllInquiries);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   get:
 *     summary: Get inquiry by ID
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inquiry found
 *       404:
 *         description: Inquiry not found
 */
router.get('/:id', ctrl.getInquiryById);

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Submit a new inquiry
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InquiryInput'
 *     responses:
 *       201:
 *         description: Inquiry submitted
 */
router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('buyerUserId').notEmpty().withMessage('Buyer user ID is required'),
    body('sellerUserId').notEmpty().withMessage('Seller user ID is required'),
    body('inquiryType').isIn(['general_question', 'purchase_offer', 'site_visit_request', 'price_negotiation']).withMessage('Invalid inquiry type'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  ctrl.createInquiry
);

/**
 * @swagger
 * /api/inquiries/{id}/status:
 *   patch:
 *     summary: Update inquiry status
 *     tags: [Inquiries]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, accepted, rejected, negotiating, closed]
 *               agentNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', ctrl.updateStatus);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   delete:
 *     summary: Delete an inquiry
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inquiry deleted
 */
router.delete('/:id', ctrl.deleteInquiry);

module.exports = router;
