const express = require('express');
const route = express.Router();
const validator = require('../middleware/validators');
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/:internshipId', verifyToken, authorizeRole('admin', 'hr'), validator.validateToEnrollment, enrollmentController.registerEnrollment);
/**
 * @swagger
 * /api/enrollment/{internshipId}:
 *   post:
 *     summary: Register internship enrollments
 *     description: Creates enrollments for accepted students of a specific internship and assigns a mentor.
 *     tags: [Internship Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the internship
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mentorEmail
 *               - studentEmails
 *             properties:
 *               mentorEmail:
 *                 type: string
 *                 example: mentor@example.com
 *               studentEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["student1@gmail.com", "student2@gmail.com"]
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Validation error (invalid input or missing fields)
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin or HR can access this endpoint
 *       404:
 *         description: Internship, mentor or students not found
 *       500:
 *         description: Internal server error
 */

route.get('/:internshipId', verifyToken, authorizeRole('mentor'), enrollmentController.getMyStudentsAsMentor);
/**
 * @swagger
 * /api/enrollment/{internshipId}:
 *   get:
 *     summary: Get mentor's students by internship
 *     description: Returns all students enrolled under a specific internship for the logged-in mentor
 *     tags: [Internship Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *     responses:
 *       200:
 *         description: Successfully retrieved enrolled students
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