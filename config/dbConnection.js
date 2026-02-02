require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    }
    catch(err)
    {
        console.error('Failed to connect with database:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;