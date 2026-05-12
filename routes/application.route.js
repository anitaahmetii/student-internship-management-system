const express = require('express');
const route = express.Router();
const applicationController = require('../controllers/application.controller');
const validate = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/multer');

route.post('/register/:internship', verifyToken, authorizeRole('student'), upload.single('cv'), applicationController.uploadApplication);
/**
 * @swagger
 * /api/application/register/{internship}:
 *   post:
 *     summary: Apply for an internship
 *     description: Allows a student to apply for a specific internship and upload CV
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: internship
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *         example: 6812ab34cd56ef7890gh1234
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

route.get('/', verifyToken, authorizeRole(['admin']), applicationController.getAllApplications);
/**
 * @swagger
 * /api/application:
 *   get:
 *     summary: Get all internship applications
 *     description: Returns all internship applications (admin only)
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all applications
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access only
 *       500:
 *         description: Internal server error
 */

route.put('/update/:application', verifyToken, authorizeRole('admin', 'hr'), validate.validateToUpdateApplication, applicationController.updateApplication);
/**
 * @swagger
 * /api/application/update/{application}:
 *   put:
 *     summary: Update internship application
 *     description: Updates an internship application status, feedback, and visibility. Admin can update any application, while HR can update only applications related to their internships.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship application ID
 *         example: 6812ab34cd56ef7890gh5678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 example: accepted
 *               feedback:
 *                 type: string
 *                 example: Strong candidate, well suited for the role
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - not allowed to update this application
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */

route.delete('/delete/:application', verifyToken, authorizeRole('admin', 'hr'), applicationController.deleteApplication);
/**
 * @swagger
 * /api/application/delete/{application}:
 *   delete:
 *     summary: Delete internship application
 *     description: Deletes an internship application. Admin can delete any application, while HR can delete only applications related to their internships.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship application ID
 *         example: 6812ab34cd56ef7890gh5678
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - not allowed to delete this application
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */

route.get('/studentApplications', verifyToken, authorizeRole('student'), applicationController.getStudentApplications);
/**
 * @swagger
 * /api/application/studentApplications:
 *   get:
 *     summary: Get student applications
 *     description: Returns all internship applications submitted by the logged-in student
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved student applications
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only students can access this endpoint
 *       500:
 *         description: Internal server error
 */

route.get('/hrApplications', verifyToken, authorizeRole('hr'), applicationController.getHrApplications);
/**
 * @swagger
 * /api/application/hrApplications:
 *   get:
 *     summary: Get HR applications
 *     description: Returns all internship applications related to internships uploaded by the logged-in HR
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved HR-related applications
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only HR can access this endpoint
 *       500:
 *         description: Internal server error
 */

route.get('/status/:status', verifyToken, authorizeRole('admin', 'hr'), validate.validateToSearchByStatus, applicationController.getApplicationsByStatus);
/**
 * @swagger
 * /api/application/status/{status}:
 *   get:
 *     summary: Get applications by status
 *     description: Returns internship applications filtered by status (pending, accepted, rejected). Admin can view all, HR can view only their related applications.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Application status filter
 *         example: accepted
 *     responses:
 *       200:
 *         description: Successfully retrieved applications by status
 *       400:
 *         description: Validation error - invalid status value
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - not allowed to access this resource
 *       500:
 *         description: Internal server error
 */

route.get('/acceptedStudents/:internshipId', verifyToken, authorizeRole('admin', 'hr'), applicationController.getAcceptedStudentsByInternship);
/**
 * @swagger
 * /api/application/acceptedStudents/{internshipId}:
 *   get:
 *     summary: Get accepted students by internship ID
 *     description: Returns a list of students whose internship applications have been accepted for a specific internship.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the internship
 *     responses:
 *       200:
 *         description: Successfully retrieved accepted students
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - not allowed to access this resource
 *       500:
 *         description: Internal server error
 */

route.put('/cv/update/:internshipId', verifyToken, authorizeRole('student'), upload.single('cv'), applicationController.updateMyCvAsStudent);
 /**
 * @swagger
 * /api/application/cv/update/{internshipId}:
 *   put:
 *     summary: Update student's CV for an internship application
 *     description: Allows a student to update their CV for a specific internship application
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *         example: 6812ab34cd56ef7890gh1234
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: CV updated successfully
 *       400:
 *         description: Bad request (missing or invalid file)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */


module.exports = route;