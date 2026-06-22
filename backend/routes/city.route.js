const express = require('express');
const route = express.Router();
const cityController = require('../controllers/city.controller');
const validate = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validate.validateCity, cityController.createCity);
/**
 * @swagger
 * /api/city/add:
 *   post:
 *     summary: Create new city
 *     description: Creates a new city and assigns it to a state (admin-only)
 *     tags: [City]
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
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *                 example: Prishtina
 *               state:
 *                 type: string
 *                 example: Kosovë
 *     responses:
 *       201:
 *         description: City created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */

route.get('/', cityController.getCities);
/**
 * @swagger
 * /api/city:
 *   get:
 *     summary: Get all cities
 *     description: Returns a list of all cities (admin only access)
 *     tags: [City]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cities
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 */

route.put('/update/:city/:state', verifyToken, authorizeRole('admin'), validate.validateToUpdateCity, cityController.updateCity);
/**
 * @swagger
 * /api/city/update/{city}/{state}:
 *   put:
 *     summary: Update city (admin-only)
 *     description: Updates city data by city name and state (admin-only)
 *     tags: [City]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to identify the city
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State name to identify the city
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Prishtina
 *               state:
 *                 type: string
 *                 example: Kosovë
 *     responses:
 *       200:
 *         description: City updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: City not found
 */

route.delete('/delete/:city/:state', verifyToken, authorizeRole('admin'), cityController.deleteCity);
/**
 * @swagger
 * /api/city/delete/{city}/{state}:
 *   delete:
 *     summary: Delete city (admin-only)
 *     description: Deletes a city by city name and state (admin-only)
 *     tags: [City]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to delete
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State name of the city
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: City not found
 */

route.get('/cities/:state', verifyToken, cityController.findCitiesByState);
/**
 * @swagger
 * /api/city/cities/{state}:
 *   get:
 *     summary: Get cities by state
 *     description: Returns all cities belonging to a specific state
 *     tags: [City]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State name
 *     responses:
 *       200:
 *         description: Successfully retrieved cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   state:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: State or cities not found
 */

route.get('/state/:city', verifyToken, cityController.findStateByCity);
/**
 * @swagger
 * /api/city/state/{city}:
 *   get:
 *     summary: Get state by city
 *     description: Returns the state of a given city
 *     tags: [City]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: Successfully retrieved state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: string
 *                   example: Kosovo
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: City not found
 */

module.exports = route;