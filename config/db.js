const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB database
 * Handles connection errors gracefully with retry logic
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop';

    // Mongoose 9.x no longer requires useNewUrlParser and useUnifiedTopology
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);

    // Detailed error logging
    if (error.name === 'MongoServerError') {
      console.error('Server Error Details:', error.message);
    } else if (error.name === 'MongoNetworkError') {
      console.error('Network Error: Unable to connect to MongoDB server');
      console.error('Please ensure MongoDB is running on:', process.env.MONGODB_URI);
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Server Selection Error: Could not connect to any servers in your MongoDB Atlas cluster');
      console.error('Check your connection string and network access');
    } else {
      console.error('Unexpected Error:', error);
    }

    // Exit process with failure
    console.error('🔴 Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for testing and graceful shutdowns
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB Disconnected Successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
};

/**
 * Get current connection status
 * @returns {string} Connection status
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
};
