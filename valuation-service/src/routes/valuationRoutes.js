const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/valuationController');

/**
 * @swagger
 * tags:
 *   name: Valuations
 *   description: Property valuation request endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ValuationInput:
 *       type: object
 *       required: [propertyId, requestedByUserId, extentPerches, district]
 *       properties:
 *         propertyId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         requestedByUserId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         extentPerches:
 *           type: number
 *           example: 20
 *         district:
 *           type: string
 *           example: Kandy
 *         valuationMethod:
 *           type: string
 *           enum: [comparative_market, income_approach, cost_approach, residual_method]
 *           example: comparative_market
 */

/**
 * @swagger
 * /api/valuations:
 *   get:
 *     summary: Get all valuations
 *     tags: [Valuations]
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
 *         name: district
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of valuations
 */
router.get('/', ctrl.getAllValuations);

/**
 * @swagger
 * /api/valuations/{id}:
 *   get:
 *     summary: Get valuation by ID
 *     tags: [Valuations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valuation found
 *       404:
 *         description: Valuation not found
 */
router.get('/:id', ctrl.getValuationById);

/**
 * @swagger
 * /api/valuations:
 *   post:
 *     summary: Request a new valuation
 *     tags: [Valuations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValuationInput'
 *     responses:
 *       201:
 *         description: Valuation request submitted
 */
router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('requestedByUserId').notEmpty().withMessage('Requester user ID is required'),
    body('extentPerches').isNumeric().withMessage('Extent must be a number'),
    body('district').notEmpty().withMessage('District is required'),
  ],
  ctrl.createValuation
);

/**
 * @swagger
 * /api/valuations/{id}:
 *   put:
 *     summary: Update a valuation
 *     tags: [Valuations]
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
 *     responses:
 *       200:
 *         description: Valuation updated
 */
router.put('/:id', ctrl.updateValuation);

/**
 * @swagger
 * /api/valuations/{id}/complete:
 *   patch:
 *     summary: Mark valuation as completed with results
 *     tags: [Valuations]
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
 *             required: [estimatedValueLKR, valuePerPerchLKR]
 *             properties:
 *               estimatedValueLKR:
 *                 type: number
 *                 example: 30000000
 *               valuePerPerchLKR:
 *                 type: number
 *                 example: 1500000
 *               valuatorName:
 *                 type: string
 *                 example: Mr. Sunil Fernando
 *               valuatorLicenseNo:
 *                 type: string
 *                 example: IVS/2023/001
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Valuation completed
 */
router.patch(
  '/:id/complete',
  [
    body('estimatedValueLKR').isNumeric().withMessage('Estimated value must be a number'),
    body('valuePerPerchLKR').isNumeric().withMessage('Value per perch must be a number'),
  ],
  ctrl.completeValuation
);

/**
 * @swagger
 * /api/valuations/{id}:
 *   delete:
 *     summary: Delete a valuation
 *     tags: [Valuations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valuation deleted
 */
router.delete('/:id', ctrl.deleteValuation);

module.exports = router;
