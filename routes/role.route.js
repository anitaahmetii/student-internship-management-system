const express = require('express');
const route = express.Router();
const roleController = require('../controllers/roles.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validator.validateRole, roleController.createRole);
route.get('/', verifyToken, authorizeRole('admin'), roleController.getRoles);
route.put('/update/:role', verifyToken, authorizeRole('admin'), validator.validateToUpdateRole, roleController.updateRole);
route.delete('/:role', verifyToken, authorizeRole('admin'), roleController.deleteRole);

module.exports = route;