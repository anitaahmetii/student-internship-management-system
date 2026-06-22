const express = require('express');
const route = express.Router();
const internshipController = require('../controllers/internship.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/upload', verifyToken, authorizeRole('admin', 'hr'), validator.validateToUploadInternship, internshipController.uploadInternship);
/**
 * @swagger
 * /api/internship/upload:
 *   post:
 *     summary: Upload internship opportunity
 *     description: Creates a new internship posting (admin and HR only)
 *     tags: [Internship]
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
 *               - companyName
 *               - responsibilities
 *               - preRequirements
 *               - applicationDeadline
 *               - location
 *             properties:
 *               position:
 *                 type: string
 *                 example: Backend Developer Intern
 *               companyName:
 *                 type: string
 *                 example: Google
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Build APIs
 *                   - Fix bugs
 *               preRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Knowledge of Node.js
 *                   - Basic SQL
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-01
 *               location:
 *                 type: string
 *                 example: Pristina
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Internship uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or HR only)
 */

route.get('/',  verifyToken, internshipController.getInternships);
/**
 * @swagger
 * /api/internship:
 *   get:
 *     summary: Get all internships
 *     description: Returns a list of all internships 
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved internships
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 */

route.put('/update/:internship', verifyToken, authorizeRole('admin', 'hr'), validator.validateToUpdateInternship, internshipController.updateInternship);
/**
 * @swagger
 * /api/internship/update/{internship}:
 *   put:
 *     summary: Update internship opportunity
 *     description: Updates an existing internship posting (admin and HR only)
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internship
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *         example: 6812ab34cd56ef7890gh1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *                 example: Full Stack Developer Intern
 *               companyName:
 *                 type: string
 *                 example: Microsoft
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Develop web applications
 *                   - Maintain APIs
 *               preRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Knowledge of JavaScript
 *                   - Familiar with MongoDB
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-01
 *               location:
 *                 type: string
 *                 example: Prishtina
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Internship updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or HR only)
 *       404:
 *         description: Internship not found
 */
route.delete('/delete/:internship', verifyToken, authorizeRole('admin', 'hr'), internshipController.deleteInternship);
/**
 * @swagger
 * /api/internship/delete/{internship}:
 *   delete:
 *     summary: Delete internship
 *     description: Deletes an internship by ID (admin or HR only)
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internship
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID to delete
 *     responses:
 *       200:
 *         description: Internship deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or HR only)
 *       404:
 *         description: Internship not found
 */

route.get('/activeInternships', verifyToken, internshipController.getActiveInternships);
/**
 * @swagger
 * /api/internship/activeInternships:
 *   get:
 *     summary: Get active internships
 *     description: Returns all internships with an application deadline greater than or equal to the current date
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active internships
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No active internships available
 *       500:
 *         description: Internal server error
 */

route.get('/inActiveInternships', verifyToken, authorizeRole('admin', 'hr'), internshipController.getInActiveInternships);
/**
 * @swagger
 * /api/internship/inActiveInternships:
 *   get:
 *     summary: Get inactive internships
 *     description: Returns internships with an expired application deadline. Admin can view all inactive internships, while HR can view only internships uploaded by themselves.
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved inactive internships
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin or HR can access
 *       404:
 *         description: No inactive internships available
 *       500:
 *         description: Internal server error
 */

route.get('/hrInternships', verifyToken, authorizeRole('admin', 'hr'), internshipController.getHRInternships);
/**
 * @swagger
 * /api/internship/hrInternships:
 *   get:
 *     summary: Get HR related internships
 *     description: Returns internships that belong to the logged-in HR (uploaded or updated by them). Admin can view all HR-related internships.
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved HR internships
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin or HR can access this resource
 *       404:
 *         description: No internships found for this HR
 *       500:
 *         description: Internal server error
 */

route.get('/byCity/:city', verifyToken, internshipController.getInternshipsByCity);
/**
 * @swagger
 * /api/internship/byCity/{city}:
 *   get:
 *     summary: Get internships by city
 *     description: Returns all internships filtered by city name
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name used to filter internships
 *         example: Prishtina
 *     responses:
 *       200:
 *         description: Successfully retrieved internships by city
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No internships found for this city
 *       500:
 *         description: Internal server error
 */

route.get('/byPosition/:position', verifyToken, internshipController.getInternshipByPosition);
/**
 * @swagger
 * /api/internship/byPosition/{position}:
 *   get:
 *     summary: Get internships by position
 *     description: Returns all internships filtered by position/title
 *     tags: [Internship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship position used for filtering
 *         example: Backend Developer
 *     responses:
 *       200:
 *         description: Successfully retrieved internships by position
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No internships found for this position
 *       500:
 *         description: Internal server error
 */

module.exports = route;