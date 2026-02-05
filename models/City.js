const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({ 
    name: { type: String, required: true, uppercase: true }, 
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true } 
}, { timestamps: true });

const City = mongoose.model('City', CitySchema);

module.exports = City;