const express = require('express');
const connectDB = require('./config/dbConnection');
const app = express();
const roleRoute = require('./routes/role.route');
const stateRoute = require('./routes/state.route');
const cityRoute = require('./routes/city.route');

app.use(express.json());
app.use('/api/role', roleRoute);
app.use('/api/state', stateRoute);
app.use('/api/city', cityRoute);


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