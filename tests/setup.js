/**
 * Jest Test Setup File
 * This file runs after the test framework is installed in the environment
 * Use this for global test configuration and utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;
// MongoDB URI will be set by MongoDB Memory Server in db-handler.js
process.env.MONGODB_URI = 'mongodb://localhost:27017/sweetshop_test';

// Increase timeout for database operations (MongoDB Memory Server can be slow on first run)
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
    // Helper function to create mock sweet data
    createMockSweet: (overrides = {}) => ({
        name: 'Test Sweet',
        description: 'A delicious test sweet',
        price: 10,
        quantity: 100,
        category: 'Chocolate',
        ...overrides,
    }),

    // Helper function to create multiple mock sweets
    createMockSweets: (count = 3) => {
        return Array.from({ length: count }, (_, i) => ({
            name: `Test Sweet ${i + 1}`,
            description: `Description for sweet ${i + 1}`,
            price: 10 + i,
            quantity: 100 + i * 10,
            category: i % 2 === 0 ? 'Chocolate' : 'Candy',
        }));
    },

    // Helper to wait for async operations
    wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Suppress console logs during tests (optional - uncomment if needed)
// const originalConsole = global.console;
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   // Keep error and warn for debugging
//   error: originalConsole.error,
//   warn: originalConsole.warn,
// };

// Add custom matchers if needed
// expect.extend({
//   toBeValidSweet(received) {
//     const pass = received.name && received.price && received.quantity;
//     return {
//       pass,
//       message: () => `Expected ${received} to be a valid sweet object`,
//     };
//   },
// });

console.log('🧪 Jest test environment configured');
console.log('📊 Test timeout: 30 seconds');
console.log('🌍 Environment: test');

