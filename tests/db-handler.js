/**
 * MongoDB Memory Server Handler for Testing
 * 
 * This module provides utilities to manage an in-memory MongoDB instance
 * for testing purposes, ensuring tests are isolated from the production database.
 * 
 * Features:
 * - Spins up MongoDB Memory Server before tests
 * - Connects Mongoose to in-memory database
 * - Clears database between tests
 * - Closes connections after tests
 * - Completely isolated from production DB
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database
 * Call this in beforeAll() hook
 */
const connect = async () => {
    try {
        // Close any existing connections
        await mongoose.disconnect();

        // Create new MongoDB Memory Server instance
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Connect to the in-memory database
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB Memory Server');
        console.log(`📊 Test Database URI: ${mongoUri}`);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB Memory Server:', error);
        throw error;
    }
};

/**
 * Drop database, close the connection and stop MongoDB Memory Server
 * Call this in afterAll() hook
 */
const closeDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }

        if (mongoServer) {
            await mongoServer.stop();
        }

        console.log('✅ Disconnected from MongoDB Memory Server');
    } catch (error) {
        console.error('❌ Error closing MongoDB Memory Server:', error);
        throw error;
    }
};

/**
 * Remove all data from all collections
 * Call this in afterEach() or beforeEach() hook
 */
const clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }

        console.log('🧹 Cleared all collections in test database');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    }
};

/**
 * Get connection status
 * Useful for debugging
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

/**
 * Get database statistics
 * Useful for debugging and verification
 */
const getDbStats = async () => {
    try {
        const collections = mongoose.connection.collections;
        const stats = {};

        for (const key in collections) {
            const collection = collections[key];
            const count = await collection.countDocuments();
            stats[key] = count;
        }

        return stats;
    } catch (error) {
        console.error('❌ Error getting database stats:', error);
        return {};
    }
};

module.exports = {
    connect,
    closeDatabase,
    clearDatabase,
    getConnectionStatus,
    getDbStats,
};
