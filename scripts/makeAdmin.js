/**
 * Make User Admin Script
 * 
 * Updates a user's role to 'admin'
 */

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const makeAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get email from command line argument or use default
        const email = process.argv[2] || 'anant.kapooor@gmail.com';

        // Find user and update role
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log(`❌ User with email ${email} not found`);
            process.exit(1);
        }

        console.log('✅ User updated to admin successfully!');
        console.log('📧 Email:', user.email);
        console.log('👤 Name:', user.name);
        console.log('👑 Role:', user.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

makeAdmin();
