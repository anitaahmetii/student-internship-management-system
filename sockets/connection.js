require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const socketConnection = async (io) =>
{
    
    io.use((socket, next) => 
    {
        try
        {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken;
            
            if (!token) return next(new Error('Socket-token not found!'));

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.user = decoded;
            next();
        }
        catch(err)
        {
            next(new Error('Socket-token unavailable!'));
        }
    })
    io.on('connection', (socket) => 
    { 
        if (socket.user.role === 'hr') socket.join('hr-room');
        console.log(`Connected: ${socket.user._id} + ${socket.user.role}`);
        socket.on('disconnect', () => 
        { 
            console.log(`Disconnected: ${socket.user._id}`); 
        });
    });
}

module.exports = socketConnection;