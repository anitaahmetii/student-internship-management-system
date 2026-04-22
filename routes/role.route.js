const express = require('express');
const route = express.Router();
const roleController = require('../controllers/roles.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validator.validateRole, roleController.createRole);
/**
 * @swagger
 * /api/role/add:
 *   post:
 *     summary: Create new role
 *     description: Creates a new role with optional permission (admin-only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *               permission:
 *                 type: string
 *                 example: manage_users
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
route.get('/', verifyToken, authorizeRole('admin'), roleController.getRoles);
/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get all roles
 *     description: Returns a list of all roles (admin only access)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved roles
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 */
route.put('/update/:role', verifyToken, authorizeRole('admin'), validator.validateToUpdateRole, roleController.updateRole);
/**
 * @swagger
 * /api/role/update/{role}:
 *   put:
 *     summary: Update role (admin-only)
 *     description: Updates role data by role name (admin-only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: Role name to update
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *               permission:
 *                 type: string
 *                 example: manage_users
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Role not found
 */

route.delete('/:role', verifyToken, authorizeRole('admin'), roleController.deleteRole);
/**
 * @swagger
 * /api/role/{role}:
 *   delete:
 *     summary: Delete role (admin-only)
 *     description: Deletes a role by role name (admin-only)
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: Role name to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Role not found
 */

module.exports = route;