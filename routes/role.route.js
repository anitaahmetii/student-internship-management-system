const express = require('express');
const route = express.Router();
const roleController = require('../controllers/roles.controller');
const validator = require('../middleware/validators');
const auth = require('../middleware/auth');

route.post('/add', auth.verifyToken(['admin']), validator.validateRole, roleController.createRole);
route.get('/', auth.verifyToken(['admin']), roleController.getRoles);
route.put('/update/:role', auth.verifyToken(['admin']), validator.validateToUpdateRole, roleController.updateRole);
route.delete('/:role', auth.verifyToken(['admin']), roleController.deleteRole);

module.exports = route;