const express = require('express');
const route = express.Router();
const progressTrackerController = require('../controllers/progressTracker.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/assignToAll/:taskId', verifyToken, authorizeRole('admin', 'mentor'), validator.validateAssign, progressTrackerController.assignTaskToStudents);
/**
 * @swagger
 * /api/progressTracker/assignToAll/{taskId}:
 *   post:
 *     summary: Assign a task to all students in the internship
 *     description: Automatically assigns the task (by taskId) to all enrolled students in the related internship. Internship is derived from the task.
 *     tags: [Progress Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to be assigned
 *         example: 65f1c2a9b2d4c8a123456789
 *     responses:
 *       201:
 *         description: Task successfully assigned to all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   enrollment:
 *                     type: string
 *                   task:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: pending
 *                   pointsEarned:
 *                     type: number
 *                     example: 0
 *                   feedback:
 *                     type: string
 *                     nullable: true
 *                   assignedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Validation error (invalid or missing taskId)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or mentor only)
 *       404:
 *         description: Task not found or not authorized
 */

route.post('/uniqueAssign/:taskId', verifyToken, authorizeRole('admin', 'mentor'), validator.validateUniqueAssign, progressTrackerController.assignUniqueTaskToStudents);
/**
 * @swagger
 * /api/progressTracker/uniqueAssign/{taskId}:
 *   post:
 *     summary: Assign task to specific students
 *     description: Assigns a task to selected students enrolled in the internship related to the task
 *     tags: [Progress Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *         example: 65f1c2a9b2d4c8a123456789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentEmails
 *             properties:
 *               studentEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 example:
 *                   - student1@gmail.com
 *                   - student2@gmail.com
 *     responses:
 *       201:
 *         description: Task successfully assigned to selected students
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or mentor only)
 *       404:
 *         description: Task or students not found
 *       409:
 *         description: Database or assignment conflict error
 */

route.get('/', verifyToken, authorizeRole('admin', 'mentor'), progressTrackerController.getAllProgressTrackers);
/**
 * @swagger
 * /api/progressTracker/:
 *   get:
 *     summary: Retrieve all progress trackers for mentor tasks
 *     description: Returns all progress tracker records related to tasks created by the authenticated mentor
 *     tags: [Progress Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress trackers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Build REST API
 *                       description:
 *                         type: string
 *                         example: Create REST APIs using Node.js and Express
 *                       requirements:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - Node.js knowledge
 *                           - Express.js basics
 *                       maxPoints:
 *                         type: number
 *                         example: 100
 *                   enrollment:
 *                     type: object
 *                     properties:
 *                       internship:
 *                         type: object
 *                         properties:
 *                           position:
 *                             type: string
 *                             example: Backend Developer Intern
 *                       student:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: student@gmail.com
 *                   feedback:
 *                     type: string
 *                     nullable: true
 *                     example: Good work
 *                   pointsEarned:
 *                     type: number
 *                     example: 85
 *                   assignedAt:
 *                     type: string
 *                     format: date-time
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     enum: [pending, done]
 *                     example: pending
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or mentor only)
 *       500:
 *         description: Database error while retrieving progress trackers
 */

route.get('/:taskId', verifyToken, authorizeRole('admin', 'mentor'), progressTrackerController.getAllProgressTrackers);
/**
 * @swagger
 * /api/progressTracker/{taskId}:
 *   get:
 *     summary: Retrieve progress trackers by task
 *     description: Returns all progress tracker records for a specific task created by the authenticated mentor
 *     tags: [Progress Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *         example: 65f1c2a9b2d4c8a123456789
 *     responses:
 *       200:
 *         description: Progress trackers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Build REST API
 *                       description:
 *                         type: string
 *                         example: Create REST APIs using Node.js and Express
 *                       requirements:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - Node.js knowledge
 *                           - Express.js basics
 *                       maxPoints:
 *                         type: number
 *                         example: 100
 *                   enrollment:
 *                     type: object
 *                     properties:
 *                       internship:
 *                         type: object
 *                         properties:
 *                           position:
 *                             type: string
 *                             example: Backend Developer Intern
 *                       student:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: student@gmail.com
 *                   feedback:
 *                     type: string
 *                     nullable: true
 *                     example: Excellent implementation
 *                   pointsEarned:
 *                     type: number
 *                     example: 90
 *                   assignedAt:
 *                     type: string
 *                     format: date-time
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     enum: [pending, done]
 *                     example: done
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin or mentor only)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Database error while retrieving progress trackers
 */

module.exports = route;