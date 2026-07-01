const http = require('http');
const express = require('express');
const connectDB = require('./config/dbConnection');
const multer = require('multer');
const app = express();
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./config/swagger');
const path = require('node:path');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', credentials: true }});
const socketConnection = require('./sockets/connection');

const userRoute = require('./routes/user.route');
const stateRoute = require('./routes/state.route');
const cityRoute = require('./routes/city.route');
const internshipRoute = require('./routes/internship.route');
const applicationRoute = require('./routes/application.route');
const enrollmentRoute = require('./routes/enrollment.route');
const progressTrackerRoute = require('./routes/progressTracker.route');
const taskRoute = require('./routes/task.route');
const companyRoute = require('./routes/company.route');

app.use(cookieParser());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use('/uploads', express.static('public/uploads'));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => { req.io = io; next(); });
socketConnection(io);

app.use('/api/user', userRoute);
app.use('/api/state', stateRoute);
app.use('/api/city', cityRoute);
app.use('/api/internship', internshipRoute);
app.use('/api/application', applicationRoute);
app.use('/api/enrollment', enrollmentRoute);
app.use('/api/progressTracker', progressTrackerRoute);
app.use('/api/task', taskRoute);
app.use('/api/companies', companyRoute);


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }

    if (err.message === "ONLY PDF FILES ARE ALLOWED") {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal server error" });
});

const startRunning = async () => 
{
    await connectDB();
    try 
    {
        server.listen(process.env.PORT, () => { console.log("System is running"); });
    }
    catch(err)
    {
        throw new Error(`Failed to run server: ${err.message}`);
    }
}
startRunning();