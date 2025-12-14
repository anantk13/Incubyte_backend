/**
 * Sweet Routes
 * 
 * Routes for sweet/candy inventory management
 * Public routes for viewing, protected routes for admin operations
 */

const express = require('express');
const router = express.Router();
const {
    getAllSweets,
    getSweetById,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
} = require('../controllers/sweetController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/sweets
 * @desc    Get all sweets
 * @access  Public
 */
router.get('/', getAllSweets);

/**
 * @route   GET /api/sweets/:id
 * @desc    Get single sweet by ID
 * @access  Public
 */
router.get('/:id', getSweetById);

/**
 * @route   POST /api/sweets
 * @desc    Create new sweet
 * @access  Private/Admin only
 */
router.post('/', protect, authorize('admin'), createSweet);

/**
 * @route   PUT /api/sweets/:id
 * @desc    Update sweet
 * @access  Private/Admin only
 */
router.put('/:id', protect, authorize('admin'), updateSweet);

/**
 * @route   DELETE /api/sweets/:id
 * @desc    Delete sweet
 * @access  Private/Admin only
 */
router.delete('/:id', protect, authorize('admin'), deleteSweet);

/**
 * @route   POST /api/sweets/:id/purchase
 * @desc    Purchase sweet (decrease quantity)
 * @access  Public
 */
router.post('/:id/purchase', purchaseSweet);

module.exports = router;
