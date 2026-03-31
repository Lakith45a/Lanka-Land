const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/propertyController');

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Land property listing endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         propertyType:
 *           type: string
 *         extentPerches:
 *           type: number
 *         pricePerPerch:
 *           type: number
 *         totalPriceLKR:
 *           type: number
 *         district:
 *           type: string
 *         status:
 *           type: string
 *     PropertyInput:
 *       type: object
 *       required: [title, description, propertyType, extentPerches, pricePerPerch, district, address, sellerUserId]
 *       properties:
 *         title:
 *           type: string
 *           example: Prime Land in Colombo 7
 *         description:
 *           type: string
 *           example: Excellent bare land in a prime location
 *         propertyType:
 *           type: string
 *           enum: [bare-land, agricultural, residential, commercial, industrial]
 *           example: bare-land
 *         extentPerches:
 *           type: number
 *           example: 20
 *         pricePerPerch:
 *           type: number
 *           example: 1500000
 *         district:
 *           type: string
 *           example: Colombo
 *         address:
 *           type: string
 *           example: "No. 45, Flower Road, Colombo 07"
 *         sellerUserId:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', ctrl.getAllProperties);

/**
 * @swagger
 * /api/properties/seller/{sellerId}:
 *   get:
 *     summary: Get properties by seller ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Properties by seller
 */
router.get('/seller/:sellerId', ctrl.getPropertiesBySeller);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property found
 *       404:
 *         description: Property not found
 */
router.get('/:id', ctrl.getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property listing
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       201:
 *         description: Property created
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('propertyType').isIn(['bare-land', 'agricultural', 'residential', 'commercial', 'industrial']).withMessage('Invalid property type'),
    body('extentPerches').isNumeric().withMessage('Extent must be a number'),
    body('pricePerPerch').isNumeric().withMessage('Price per perch must be a number'),
    body('district').notEmpty().withMessage('District is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('sellerUserId').notEmpty().withMessage('Seller user ID is required'),
  ],
  ctrl.createProperty
);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
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
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       200:
 *         description: Property updated
 */
router.put('/:id', ctrl.updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted
 */
router.delete('/:id', ctrl.deleteProperty);

/**
 * @swagger
 * /api/properties/{id}/status:
 *   patch:
 *     summary: Update property status
 *     tags: [Properties]
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
 *                 enum: [available, under_negotiation, sold, withdrawn]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
