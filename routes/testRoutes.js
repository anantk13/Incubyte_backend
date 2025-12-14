/**
 * Test Routes
 * Debug endpoints to help troubleshoot issues
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * Test endpoint to check User model schema
 */
router.get('/user-schema', (req, res) => {
    const schema = User.schema.obj;
    res.json({
        success: true,
        schema: schema,
        paths: Object.keys(User.schema.paths),
    });
});

/**
 * Test endpoint to check request body
 */
router.post('/test-body', (req, res) => {
    console.log('📦 Received body:', req.body);
    res.json({
        success: true,
        receivedBody: req.body,
        bodyKeys: Object.keys(req.body),
    });
});

module.exports = router;
