const mongoose = require('mongoose');

 const UserSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, 
    surname: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    birthDate: { type: Date, required: true }, 
    phoneNumber: { type: String, unique: true }, 
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }, 
    password: { type: String, required: true, min: 6 },
    isVisible: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true } 
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;