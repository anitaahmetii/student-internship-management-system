const express = require('express');
const route = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const validator = require('../middleware/validators');

route.post('/register/:internshipId', verifyToken, authorizeRole('admin', 'mentor'), validator.validateToAddTask, taskController.registerTask);
/**
 * @swagger
 * /api/task/register/{internshipId}:
 *   post:
 *     summary: Register a new task for an internship
 *     description: Creates a new task under a specific internship (admin and mentor only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1c2a9b2d4c8a123456789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requirements
 *               - maxPoints
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build REST API
 *               description:
 *                 type: string
 *                 example: Create a REST API using Node.js and Express
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Node.js knowledge
 *                   - Express.js basics
 *               maxPoints:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Internship not found
 */
route.get('/:internshipId', verifyToken, authorizeRole('admin', 'mentor'), taskController.getTasksAsMentor);
/**
 * @swagger
 * /api/task/{internshipId}:
 *   get:
 *     summary: Get tasks by internship
 *     description: Returns all tasks created for a specific internship (admin and mentor only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1c2a9b2d4c8a123456789
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   internship:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   requirements:
 *                     type: array
 *                     items:
 *                       type: string
 *                   maxPoints:
 *                     type: number
 *                   createdBy:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Internship not found
 */

module.exports = route;