const express = require('express');
const connectDB = require('./config/dbConnection');
const app = express();
const roleRoute = require('./routes/role.route');
const userRoute = require('./routes/user.route');
const stateRoute = require('./routes/state.route');
const cityRoute = require('./routes/city.route');
const internshipRoute = require('./routes/internship.route');
const applicationRoute = require('./routes/application.route');
const enrollmentRoute = require('./routes/enrollment.route');

app.use(express.json());
app.use('/api/role', roleRoute);
app.use('/api/user', userRoute);
app.use('/api/state', stateRoute);
app.use('/api/city', cityRoute);
app.use('/api/internship', internshipRoute);
app.use('/api/application', applicationRoute);
app.use('/api/enrollment', enrollmentRoute);

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