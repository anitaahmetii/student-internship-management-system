require('dotenv').config();
const { seedRoles } = require('./roleSeeder');
const { seedAdmin } = require('./adminSeeder');
const connectDB = require('../config/dbConnection');
const mongoose = require('mongoose');

const runSeeders = async () => {
    try 
    {
        await connectDB();
        await seedRoles();
        await seedAdmin();
    } 
    catch (err) 
    {
        console.error(err.message);
    } 
    finally 
    {
        await mongoose.disconnect();
        process.exit(0);
    }
};

runSeeders();