const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({ 
    name: { type: String, required: true, uppercase: true, unique: true }, 
    code: { type: String, required: true, uppercase: true, unique: true }, 
}, { timestamps: true });

const State = mongoose.model('State', StateSchema);

module.exports = State;