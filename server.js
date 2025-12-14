const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// Initialize Express app
const app = express();

// Middleware - Configure CORS to allow frontend on port 3000 or 3001 and production
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://incubyte-frontend-lake.vercel.app', // Production frontend URL
        /\.vercel\.app$/, // Allow all Vercel preview deployments
        /\.netlify\.app$/, // Allow all Netlify preview deployments
    ],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware - Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    if (req.method === 'POST') {
        console.log('📦 Body:', req.body);
    }
    next();
});

// Connect to Database (skip in test environment - tests use MongoDB Memory Server)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Import Routes
const authRoutes = require('./routes/authRoutes');
const sweetRoutes = require('./routes/sweetRoutes');
const testRoutes = require('./routes/testRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/test', testRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server on port 5000 (skip in test environment)
const PORT = process.env.PORT || 5000;
let server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📍 URL: http://localhost:${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error('❌ Unhandled Promise Rejection:', err);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
}

module.exports = app;
