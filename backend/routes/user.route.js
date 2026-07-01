const express = require('express');
const route = express.Router();
const userController = require('../controllers/user.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/register', validator.validateToRegisterUser, userController.registerUser);
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register new user
 *     description: Creates a new user account. The role is assigned automatically by the system.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - birthDate
 *               - city
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: "044123456"
 *               city:
 *                 type: string
 *                 example: Pristina
 *               password:
 *                 type: string
 *                 example: "123456"
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
route.post('/registerHr', verifyToken, authorizeRole('admin'), userController.registerUserAsHR);
/**
 * @swagger
 * /api/user/registerHr:
 *   post:
 *     summary: Register new HR user
 *     description: Creates a new HR account and links it to an existing company. The role is automatically assigned as "hr". Only admins can perform this action.
 *     tags: [Authentication]
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
 *               - surname
 *               - email
 *               - birthDate
 *               - city
 *               - password
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hr@company.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1995-05-15
 *               phoneNumber:
 *                 type: string
 *                 example: "044123456"
 *               city:
 *                 type: string
 *                 example: Pristina
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               company:
 *                 type: string
 *                 description: ID of an existing company to link this HR user to
 *                 example: "507f1f77bcf86cd799439011"
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: HR user registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only admins can register HR users
 *       409:
 *         description: Conflict - Email/phone number already exists, city not available, or company not available
 */
 
route.post('/registerMentor', verifyToken, authorizeRole('admin'), userController.registerUserAsMentor);
/**
 * @swagger
 * /api/user/registerMentor:
 *   post:
 *     summary: Register new mentor user
 *     description: Creates a new mentor account. The role is automatically assigned as "mentor". Only admins can perform this action.
 *     tags: [Authentication]
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
 *               - surname
 *               - email
 *               - birthDate
 *               - city
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mentor@company.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *               phoneNumber:
 *                 type: string
 *                 example: "044123456"
 *               city:
 *                 type: string
 *                 example: Pristina
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Mentor user registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only admins can register mentor users
 */

route.post('/login', validator.validateToLoginUser, userController.loginUser);
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user using email and password and returns JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
 *       400:
 *         description: Invalid credentials or validation error
 *       404:
 *         description: User not found
 */

route.get('/', verifyToken, authorizeRole('admin'), userController.getUsers);
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users (admin only access)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 */

route.post('/refreshToken', userController.refreshToken);
/**
 * @swagger
 * /api/user/refreshToken:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *     responses:
 *       200:
 *         description: New tokens generated successfully
 *       401:
 *         description: Invalid or expired refresh token
 */

route.get('/currentUser', verifyToken, userController.getCurrentUser);
/**
 * @swagger
 * /api/user/currentUser:
 *  get:
 *      summary: Get current user
 *      description: Retrieve the currently authenticated user
 *      tags: [User]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Current user retrieved successfully
 *          401:
 *              description: Unauthorized
 *      
 */

route.delete('/delete/:id', verifyToken, authorizeRole('admin'), userController.deleteUser);
/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete user (admin-only)
 *     description: Delete user by ID (admin-only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: User not found
 */

route.put('/update/:email', verifyToken, authorizeRole('admin'), validator.validateToUpdateUser, userController.updateUser);
/**
 * @swagger
 * /api/user/update/{email}:
 *   put:
 *     summary: Update user (admin-only)
 *     description: Update user data by email (admin-only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email to update
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: "044-123-456"
 *               city:
 *                 type: string
 *                 example: Pristina
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: User not found
 */
route.post('/logout', verifyToken, userController.logoutUser);
/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the currently authenticated user by invalidating the refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */

module.exports = route;