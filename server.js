const express = require('express');
const connectDB = require('./config/dbConnection');
const app = express();

const startRunning = async () => 
{
    await connectDB();
    try 
    {
        app.listen(process.env.PORT, () => { console.log("System is running"); });
    }
    catch(err)
    {
        throw new Error(`Failed to run server: ${err.message}`);
    }
}
startRunning();