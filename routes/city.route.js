const express = require('express');
const route = express.Router();
const cityController = require('../controllers/city.controller');
const validate = require('../middleware/validators');
const { verifyToken, authorizeRole } = require('../middleware/auth');

route.post('/add', verifyToken, authorizeRole('admin'), validate.validateCity, cityController.createCity);
route.get('/', cityController.getCities);
route.put('/update/:city/:state', verifyToken, authorizeRole('admin'), validate.validateToUpdateCity, cityController.updateCity);
route.delete('/delete/:city/:state', verifyToken, authorizeRole('admin'), cityController.deleteCity);
route.get('/cities/:state', verifyToken, cityController.findCitiesByState);
route.get('/state/:city', verifyToken, cityController.findStateByCity);

module.exports = route;