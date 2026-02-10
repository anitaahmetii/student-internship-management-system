const express = require('express');
const route = express.Router();
const cityController = require('../controllers/city.controller');
const validate = require('../middleware/validators');
const auth = require('../middleware/auth');

route.post('/add', auth.verifyToken(['admin']), validate.validateCity, cityController.createCity);
route.get('/', cityController.getCities);
route.put('/update/:city/:state', auth.verifyToken(['admin']), validate.validateToUpdateCity, cityController.updateCity);
route.delete('/delete/:city/:state', auth.verifyToken(['admin']), cityController.deleteCity);
route.get('/cities/:state', cityController.findCitiesByState);
route.get('/state/:city', cityController.findStateByCity);

module.exports = route;