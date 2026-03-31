const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/appointmentController');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Site visit and meeting appointment endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentInput:
 *       type: object
 *       required: [propertyId, buyerUserId, sellerUserId, appointmentType, scheduledDate, scheduledTime, location]
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
 *         appointmentType:
 *           type: string
 *           enum: [site_visit, document_review, negotiation_meeting, notary_appointment]
 *           example: site_visit
 *         scheduledDate:
 *           type: string
 *           format: date
 *           example: "2026-04-15"
 *         scheduledTime:
 *           type: string
 *           example: "10:00"
 *         location:
 *           type: string
 *           example: "No. 45, Flower Road, Colombo 07"
 *         notes:
 *           type: string
 *           example: Please bring your NIC for verification
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
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
 *       - in: query
 *         name: appointmentType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/', ctrl.getAllAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', ctrl.getAppointmentById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Schedule a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       201:
 *         description: Appointment scheduled
 */
router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('buyerUserId').notEmpty().withMessage('Buyer user ID is required'),
    body('sellerUserId').notEmpty().withMessage('Seller user ID is required'),
    body('appointmentType').isIn(['site_visit', 'document_review', 'negotiation_meeting', 'notary_appointment']).withMessage('Invalid appointment type'),
    body('scheduledDate').isISO8601().withMessage('Valid date required (YYYY-MM-DD)'),
    body('scheduledTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be HH:MM'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  ctrl.createAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
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
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.put('/:id', ctrl.updateAppointment);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
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
 *                 enum: [scheduled, confirmed, completed, cancelled, rescheduled]
 *               cancellationReason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', ctrl.updateStatus);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
router.delete('/:id', ctrl.deleteAppointment);

module.exports = router;
