const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({ 
    role: { type: String, required: true, lowercase: true }, 
    permission: { type: String } 
}, { timestamps: true });

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role; 