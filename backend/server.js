require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  try {
    const db = require('./config/db');
    await db();
  } catch (err) {
    console.error('Failed to load database module:', err);
  }
};
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Connect to MongoDB Database
connectDB();

// CORS Middleware (Enable requests from React frontend, e.g. Port 5173 or all origins)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Express JSON parsing middleware
app.use(express.json());

// Main Root API Ping Route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running successfully' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Unmatched routes 404 handler
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
