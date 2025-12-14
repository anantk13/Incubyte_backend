/**
 * Sweet Controller
 * 
 * Handles CRUD operations for sweets/candy inventory
 * Includes inventory management and purchase logic
 */

const Sweet = require('../models/Sweet');

/**
 * @desc    Get all sweets
 * @route   GET /api/sweets
 * @access  Public
 */
const getAllSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sweets.length,
            data: sweets,
        });
    } catch (error) {
        console.error('Get all sweets error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sweets',
        });
    }
};

/**
 * @desc    Get single sweet by ID
 * @route   GET /api/sweets/:id
 * @access  Public
 */
const getSweetById = async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(200).json({
            success: true,
            data: sweet,
        });
    } catch (error) {
        console.error('Get sweet by ID error:', error);

        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching sweet',
        });
    }
};

/**
 * @desc    Create new sweet
 * @route   POST /api/sweets
 * @access  Private/Admin
 */
const createSweet = async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;

        // Validate required fields
        if (!name || !category || price === undefined || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, category, price, and quantity',
            });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0',
            });
        }

        // Validate quantity
        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity cannot be negative',
            });
        }

        // Create sweet
        const sweet = await Sweet.create({
            name,
            category,
            price,
            quantity,
            description,
        });

        res.status(201).json({
            success: true,
            message: 'Sweet created successfully',
            data: sweet,
        });
    } catch (error) {
        console.error('Create sweet error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating sweet',
        });
    }
};

/**
 * @desc    Update sweet
 * @route   PUT /api/sweets/:id
 * @access  Private/Admin
 */
const updateSweet = async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;

        // Validate price if provided
        if (price !== undefined && price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0',
            });
        }

        // Validate quantity if provided
        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity cannot be negative',
            });
        }

        const sweet = await Sweet.findByIdAndUpdate(
            req.params.id,
            { name, category, price, quantity, description },
            {
                new: true, // Return updated document
                runValidators: true, // Run model validators
            }
        );

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Sweet updated successfully',
            data: sweet,
        });
    } catch (error) {
        console.error('Update sweet error:', error);

        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating sweet',
        });
    }
};

/**
 * @desc    Delete sweet
 * @route   DELETE /api/sweets/:id
 * @access  Private/Admin
 */
const deleteSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndDelete(req.params.id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Sweet deleted successfully',
            data: {},
        });
    } catch (error) {
        console.error('Delete sweet error:', error);

        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting sweet',
        });
    }
};

/**
 * @desc    Purchase sweet (decrease quantity)
 * @route   POST /api/sweets/:id/purchase
 * @access  Public
 */
const purchaseSweet = async (req, res) => {
    try {
        const { quantity = 1 } = req.body;

        // Validate quantity
        if (quantity < 1 || !Number.isInteger(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive integer',
            });
        }

        // Use atomic update with $inc to prevent race conditions
        const sweet = await Sweet.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: quantity }, // Ensure enough quantity available
            },
            {
                $inc: { quantity: -quantity }, // Decrease quantity atomically
            },
            {
                new: true, // Return updated document
                runValidators: true,
            }
        );

        if (!sweet) {
            // Check if sweet exists
            const existingSweet = await Sweet.findById(req.params.id);

            if (!existingSweet) {
                return res.status(404).json({
                    success: false,
                    message: 'Sweet not found',
                });
            }

            // Sweet exists but insufficient quantity
            return res.status(400).json({
                success: false,
                message: `Insufficient quantity. Only ${existingSweet.quantity} available.`,
            });
        }

        // Update inStock status
        sweet.inStock = sweet.quantity > 0;
        await sweet.save();

        res.status(200).json({
            success: true,
            message: 'Purchase successful',
            data: sweet,
        });
    } catch (error) {
        console.error('Purchase sweet error:', error);

        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error processing purchase',
        });
    }
};

module.exports = {
    getAllSweets,
    getSweetById,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
};
