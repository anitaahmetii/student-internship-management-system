const express = require('express');
const route = express.Router();
const stateController = require('../controllers/state.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validator.validateState, stateController.createState);
/**
 * @swagger
 * /api/state/add:
 *   post:
 *     summary: Create new state
 *     description: Creates a new state (admin-only)
 *     tags: [State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kosovo
 *               code:
 *                 type: string
 *                 example: XK
 *     responses:
 *       201:
 *         description: State created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */

route.get('/', verifyToken, authorizeRole('admin'), stateController.getStates);
/**
 * @swagger
 * /api/state:
 *   get:
 *     summary: Get all states
 *     description: Returns a list of all states (admin only access)
 *     tags: [State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved states
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 */

route.put('/update/:name', verifyToken, authorizeRole('admin'), validator.validateToUpdateState, stateController.updateState);
/**
 * @swagger
 * /api/state/update/{name}:
 *   put:
 *     summary: Update state (admin-only)
 *     description: Updates state data by name (admin-only)
 *     tags: [State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: State name to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kosovo
 *               code:
 *                 type: string
 *                 example: XK
 *     responses:
 *       200:
 *         description: State updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: State not found
 */

route.delete('/delete/:name', verifyToken, authorizeRole('admin'), stateController.deleteState);
/**
 * @swagger
 * /api/state/delete/{name}:
 *   delete:
 *     summary: Delete state (admin-only)
 *     description: Deletes a state by name (admin-only)
 *     tags: [State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: State name to delete
 *     responses:
 *       200:
 *         description: State deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: State not found
 */

module.exports = route;