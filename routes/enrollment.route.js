const express = require('express');
const route = express.Router();
const validator = require('../middleware/validators');
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/enrollment', verifyToken, authorizeRole('admin', 'hr'), validator.validateToEnrollment, enrollmentController.registerEnrollment);
/**
 * @swagger
 * /api/enrollment:
 *   post:
 *     summary: Register internship enrollments
 *     description: Creates enrollments for accepted students and assigns a mentor. Only admin and HR can perform this action.
 *     tags: [Internship Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *               - mentorEmail
 *             properties:
 *               position:
 *                 type: string
 *                 example: Backend Developer Intern
 *               mentorEmail:
 *                 type: string
 *                 example: mentor@example.com
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin or HR can access this endpoint
 *       404:
 *         description: Position or mentor not found / no accepted applications
 *       500:
 *         description: Internal server error
 */

route.get('/:position', verifyToken, authorizeRole('mentor'), enrollmentController.getEnrollments);
/**
 * @swagger
 * /api/enrollment/{position}:
 *   get:
 *     summary: Get enrollments by internship position
 *     description: Returns all students enrolled under a specific internship position for the logged-in mentor
 *     tags: [Internship Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship position/title used to filter enrollments
 *         example: Backend Developer Intern
 *     responses:
 *       200:
 *         description: Successfully retrieved enrollments
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only mentors can access this endpoint
 *       404:
 *         description: Internship not found or no enrollments available
 *       500:
 *         description: Internal server error
 */

module.exports = route;