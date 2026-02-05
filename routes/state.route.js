const express = require('express');
const route = express.Router();
const stateController = require('../controllers/state.controller');
const validator = require('../middleware/validators');

route.post('/add', validator.validateState, stateController.createState);
route.get('/', stateController.getStates);
route.put('/update/:name', validator.validateToUpdateState, stateController.updateState);
route.delete('/delete/:name', stateController.deleteState);

module.exports = route;