const express = require('express');
const route = express.Router();
const validator = require('../middleware/validators');
const companyController = require('../controllers/company.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validator.validateCreateCompany, companyController.createCompany);
/**
 * @swagger
 * /api/companies/add:
 *   post:
 *     summary: Create a new company
 *     description: Creates a new company in the system. Only admin users can create companies.
 *     tags: [Companies]
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
 *               - email
 *               - industry
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Tech Corp"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "hr@techcorp.com"
 *               industry:
 *                 type: string
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Leading tech company"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Tech Street"
 *               city:
 *                 type: string
 *                 example: "San Francisco"
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: "https://techcorp.com"
 *               logoUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://techcorp.com/logo.png"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company created successfully!"
 *                 company:
 *                   type: object
 *       400:
 *         description: Validation error or duplicate email/phone number
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin can create companies
 *       500:
 *         description: Internal server error
 */

route.get('/', verifyToken, companyController.getAllCompanies);
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     description: Retrieves a list of all companies in the system. Authentication is required.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No companies found
 *       500:
 *         description: Internal server error
 */

route.get('/name/:name', verifyToken, validator.validateGetByName, companyController.getCompanyByName);
/**
 * @swagger
 * /api/companies/name/{name}:
 *   get:
 *     summary: Get company by name
 *     description: Searches for a company by name (case-insensitive). Authentication is required.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Company name to search
 *         example: "Tech Corp"
 *     responses:
 *       200:
 *         description: Successfully found the company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No company found with this name
 *       500:
 *         description: Internal server error
 */

route.get('/industry/:industry', verifyToken, validator.validateGetByIndustry, companyController.getCompaniesByIndustry);
/**
 * @swagger
 * /api/companies/industry/{industry}:
 *   get:
 *     summary: Get companies by industry
 *     description: Retrieves all companies in a specific industry. Authentication is required.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: industry
 *         required: true
 *         schema:
 *           type: string
 *         description: Industry type
 *         example: "Technology"
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No companies found in this industry
 *       500:
 *         description: Internal server error
 */

route.get('/city/:city', verifyToken, validator.validateGetByCity, companyController.getCompaniesByCity);
/**
 * @swagger
 * /api/companies/city/{city}:
 *   get:
 *     summary: Get companies by city
 *     description: Retrieves all companies in a specific city. Authentication is required.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *         example: "San Francisco"
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No companies found in this city
 *       500:
 *         description: Internal server error
 */

route.get('/active/all', verifyToken, companyController.getActiveCompanies);
/**
 * @swagger
 * /api/companies/active/all:
 *   get:
 *     summary: Get all active companies
 *     description: Retrieves all companies with active status. Authentication is required.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: No active companies found
 *       500:
 *         description: Internal server error
 */

route.get('/createdByMe', verifyToken, authorizeRole('admin'), companyController.getMyCompanies);
/**
 * @swagger
 * /api/companies/createdByMe:
 *   get:
 *     summary: Get companies created by current user
 *     description: Retrieves all companies created by the authenticated admin user. Only admin users can access this endpoint.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin users can access this endpoint
 *       404:
 *         description: User hasn't created any companies
 *       500:
 *         description: Internal server error
 */

route.get('/:id', verifyToken, authorizeRole('admin'), validator.validateGetCompanyById, companyController.getCompanyById);
/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     description: Retrieves a specific company by its ID. Only admin users can access this endpoint.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Successfully retrieved the company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin can access this endpoint
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */

route.put('/:id', verifyToken, authorizeRole('admin'), validator.validateUpdateCompany, companyController.updateCompany);
/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company
 *     description: Updates an existing company. Only admin users can update companies.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               industry:
 *                 type: string
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *               logoUrl:
 *                 type: string
 *                 format: uri
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully!"
 *                 company:
 *                   type: object
 *       400:
 *         description: Validation error or duplicate email/phone number
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin can update companies
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */

route.delete('/:id', verifyToken, authorizeRole('admin'), validator.validateDeleteCompany, companyController.deleteCompany);
/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company
 *     description: Deletes a company from the system. Only admin users can delete companies.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company deleted successfully!"
 *                 company:
 *                   type: object
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - only admin can delete companies
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */

module.exports = route;