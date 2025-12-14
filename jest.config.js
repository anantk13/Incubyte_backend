module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'models/**/*.js',
        'controllers/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        'config/**/*.js',
        '!**/node_modules/**',
        '!**/tests/**',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Setup files - runs after test framework is installed
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Global setup - runs once before all tests
    // globalSetup: '<rootDir>/tests/globalSetup.js',

    // Global teardown - runs once after all tests
    // globalTeardown: '<rootDir>/tests/globalTeardown.js',

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks between tests
    restoreMocks: true,

    // Test timeout (increased for MongoDB operations)
    testTimeout: 30000,

    // Force exit after tests complete
    forceExit: true,

    // Detect open handles (helps find memory leaks)
    detectOpenHandles: true,

    // Maximum number of workers
    maxWorkers: 1, // Run tests serially to avoid DB conflicts

    // Automatically clear mock calls and instances between tests
    clearMocks: true,

    // Coverage directory
    coverageDirectory: 'coverage',

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'html'],
};

