const express = require('express');
const route = express.Router();
const stateController = require('../controllers/state.controller');
const validator = require('../middleware/validators');
const auth = require('../middleware/auth');

route.post('/add', auth.verifyToken(['admin']), validator.validateState, stateController.createState);
route.get('/', stateController.getStates);
route.put('/update/:name', auth.verifyToken(['admin']), validator.validateToUpdateState, stateController.updateState);
route.delete('/delete/:name', auth.verifyToken(['admin']), stateController.deleteState);

module.exports = route;