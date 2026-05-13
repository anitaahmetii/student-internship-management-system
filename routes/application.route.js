const express = require('express');
const route = express.Router();
const applicationController = require('../controllers/application.controller');
const validate = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/multer');

route.post('/apply/:internship', verifyToken, authorizeRole('student'), upload.single('cv'), applicationController.applyForInternship);
/**
 * @swagger
 * /api/application/apply/{internship}:
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

route.get('/applicants/:internshipId', verifyToken, authorizeRole('admin', 'hr'), applicationController.getAllApplicantsAsHR);
/**
 * @swagger
 * /api/application/applicants/{internshipId}:
 *   get:
 *     summary: Get all applicants for an internship
 *     description: Returns all students who applied for a specific internship (admin and HR only). HR can only view applicants for their own posted internships.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         example: 663f1a2b4c1d2e3f4a5b6c7d
 *     responses:
 *       200:
 *         description: Successfully retrieved all applicants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: student@gmail.com
 *                   cvUrl:
 *                     type: string
 *                     format: uri
 *                     example: http://localhost:3000/uploads/cv.pdf
 *                   internship:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Software Engineer Intern
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Prishtinë
 *                       uploadedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: hr@gmail.com
 *                       updatedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: hr@gmail.com
 *                   appliedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-01T00:00:00.000Z
 *                   status:
 *                     type: string
 *                     enum: [pending, accepted, rejected]
 *                     example: pending
 *                   feedback:
 *                     type: string
 *                     example: Good candidate
 *                   reviewedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-02T00:00:00.000Z
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin or HR access only
 *       404:
 *         description: Internship not found
 *       500:
 *         description: Internal server error
 */
route.get('/student/cv/:internshipId/:studentEmail', verifyToken, authorizeRole('admin', 'hr'), applicationController.getStudentCVAsHR);
/**
 * @swagger
 * /api/application/student/cv/{internshipId}/{studentEmail}:
 *   get:
 *     summary: Get student CV
 *     description: Returns the CV of a student who applied for a specific internship (admin and HR only). HR can only view CVs for their own posted internships.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         example: 663f1a2b4c1d2e3f4a5b6c7d
 *       - in: path
 *         name: studentEmail
 *         required: true
 *         schema:
 *           type: string
 *         example: student@gmail.com
 *     responses:
 *       302:
 *         description: Redirects directly to the CV PDF file
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin or HR access only
 *       404:
 *         description: Student or internship not found
 *       500:
 *         description: Internal server error
 */
route.put('/update/:applicationId', verifyToken, authorizeRole('admin', 'hr'), validate.validateToUpdateApplication, applicationController.updateApplication);
/**
 * @swagger
 * /api/application/update/{applicationId}:
 *   put:
 *     summary: Update internship application
 *     description: Updates an internship application status, feedback, and visibility. Admin can update any application, while HR can update only applications related to their internships.
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
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
route.get('/studentApplications', verifyToken, authorizeRole('student'), applicationController.getStudentApplications);
/**
 * @swagger
 * /api/application/studentApplications:
 *   get:
 *     summary: Get my applications
 *     description: Returns all internship applications submitted by the logged-in student
 *     tags: [InternshipApplication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved student applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: student@gmail.com
 *                   cvUrl:
 *                     type: string
 *                     format: uri
 *                     example: http://localhost:3000/uploads/cv.pdf
 *                   internship:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Software Engineer Intern
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Prishtinë
 *                       uploadedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: hr@gmail.com
 *                       updatedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: hr@gmail.com
 *                   appliedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-01T00:00:00.000Z
 *                   status:
 *                     type: string
 *                     enum: [pending, accepted, rejected]
 *                     example: pending
 *                   feedback:
 *                     type: string
 *                     example: Good candidate
 *                   reviewedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-02T00:00:00.000Z
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only students can access this endpoint
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


route.get('/', verifyToken, authorizeRole('admin'), applicationController.getAllApplications);
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: student@gmail.com
 *                   cvUrl:
 *                     type: string
 *                     format: uri
 *                     example: http://localhost:3000/uploads/cv.pdf
 *                   internship:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Software Engineer Intern
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Prishtinë
 *                       uploadedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: admin@gmail.com
 *                       updatedBy:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: admin@gmail.com
 *                   appliedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-01T00:00:00.000Z
 *                   status:
 *                     type: string
 *                     enum: [pending, accepted, rejected]
 *                     example: pending
 *                   feedback:
 *                     type: string
 *                     example: Good candidate
 *                   reviewedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-02T00:00:00.000Z
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access only
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

module.exports = route;