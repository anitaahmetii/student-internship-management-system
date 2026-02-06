const express = require('express');
const route = express.Router();
const roleController = require('../controllers/roles.controller');
const validator = require('../middleware/validators');

route.post('/add', validator.validateRole, roleController.createRole);
route.get('/', roleController.getRoles);
route.put('/update/:role', validator.validateToUpdateRole, roleController.updateRole);
route.delete('/:role', roleController.deleteRole);

module.exports = route;