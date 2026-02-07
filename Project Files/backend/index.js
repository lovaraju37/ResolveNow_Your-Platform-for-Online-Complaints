const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const assignedRoutes = require('./routes/assigned');
const messageRoutes = require('./routes/messages');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorMiddleware');

const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (adjust for production)
        methods: ["GET", "POST"]
    }
});

// Make io available in routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/assigned', assignedRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

// Database Connection
mongoose.connect(config.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to ResolveNow API');
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error Handling Middleware (Should be last)
app.use(errorHandler);

// Start Server
server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});