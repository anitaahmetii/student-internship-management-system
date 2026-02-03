const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, 
    code: { type: String, required: true }, 
}, { timestamps: true });

const State = mongoose.model('State', StateSchema);

module.exports = State;