const express = require('express');
const route = express.Router();
const cityController = require('../controllers/city.controller');
const validate = require('../middleware/validators');

route.post('/add', validate.validateCity, cityController.createCity);
route.get('/', cityController.getCities);
route.put('/update/:city', validate.validateToUpdateCity, cityController.updateCity);
route.delete('/delete/:city/:state', cityController.deleteCity);
route.get('/cities/:state', cityController.findCitiesByState);
route.get('/state/:city', cityController.findStateByCity);

module.exports = route;