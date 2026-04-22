const express = require('express');
const route = express.Router();
const stateController = require('../controllers/state.controller');
const validator = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validator.validateState, stateController.createState);
route.get('/', verifyToken, authorizeRole('admin'), stateController.getStates);
route.put('/update/:name', verifyToken, authorizeRole('admin'), validator.validateToUpdateState, stateController.updateState);
route.delete('/delete/:name', verifyToken, authorizeRole('admin'), stateController.deleteState);

module.exports = route;