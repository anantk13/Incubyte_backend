/**
 * Quick test to create a user directly
 */

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const testUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Try to create a user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        console.log('✅ User created successfully:', user);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
        process.exit(1);
    }
};

testUser();
