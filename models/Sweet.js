/**
 * Sweet Model
 * 
 * Mongoose schema for Sweet/Candy inventory
 * Includes validation for price, quantity, and required fields
 */

const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Sweet name is required'],
            trim: true,
            minlength: [2, 'Sweet name must be at least 2 characters long'],
            maxlength: [100, 'Sweet name cannot exceed 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: {
                values: ['Chocolate', 'Candy', 'Gummy', 'Lollipop', 'Hard Candy', 'Soft Candy', 'Other'],
                message: '{VALUE} is not a valid category',
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number'],
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: 'Price must be greater than 0',
            },
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be a whole number',
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

/**
 * Pre-save hook to update inStock status based on quantity
 * Mongoose 9.x - no need for next() callback
 */
sweetSchema.pre('save', function () {
    this.inStock = this.quantity > 0;
});

/**
 * Method to check if sweet is available for purchase
 * @param {number} requestedQuantity - Quantity requested
 * @returns {boolean} - True if available, false otherwise
 */
sweetSchema.methods.isAvailable = function (requestedQuantity = 1) {
    return this.quantity >= requestedQuantity;
};

/**
 * Method to decrease quantity (for purchases)
 * @param {number} amount - Amount to decrease
 * @returns {Promise<Sweet>} - Updated sweet document
 */
sweetSchema.methods.decreaseQuantity = async function (amount = 1) {
    if (this.quantity < amount) {
        throw new Error('Insufficient quantity available');
    }

    this.quantity -= amount;
    this.inStock = this.quantity > 0;

    return await this.save();
};

/**
 * Static method to find sweets by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of sweets
 */
sweetSchema.statics.findByCategory = function (category) {
    return this.find({ category });
};

/**
 * Static method to find in-stock sweets
 * @returns {Promise<Array>} - Array of in-stock sweets
 */
sweetSchema.statics.findInStock = function () {
    return this.find({ inStock: true, quantity: { $gt: 0 } });
};

/**
 * Virtual for formatted price
 */
sweetSchema.virtual('formattedPrice').get(function () {
    return `$${this.price.toFixed(2)}`;
});

// Ensure virtuals are included when converting to JSON
sweetSchema.set('toJSON', { virtuals: true });
sweetSchema.set('toObject', { virtuals: true });

const Sweet = mongoose.model('Sweet', sweetSchema);

module.exports = Sweet;
