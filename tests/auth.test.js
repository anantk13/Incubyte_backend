/**
 * Authentication Tests
 * 
 * Test suite for user registration and login functionality
 * Following TDD approach - RED, GREEN, REFACTOR
 */

const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');
const User = require('../models/User');

describe('Authentication API', () => {
    // Connect to in-memory database before all tests
    beforeAll(async () => {
        await dbHandler.connect();
    });

    // Clear database after each test
    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    // Close database connection after all tests
    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user with valid data and return 201 status', async () => {
            // Arrange
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('name', 'John Doe');
            expect(response.body.user).toHaveProperty('email', 'john@example.com');
            expect(response.body.user).not.toHaveProperty('password'); // Password should not be returned
        });

        test('should return 400 error if email already exists', async () => {
            // Arrange - Create a user first
            const existingUser = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
            };

            await User.create(existingUser);

            // Act - Try to register with same email
            const duplicateUser = {
                name: 'Jane Smith',
                email: 'jane@example.com', // Same email
                password: 'password456',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(duplicateUser)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toMatch(/email.*already.*exists/i);
        });

        test('should return 400 error if required fields are missing', async () => {
            // Arrange
            const incompleteUser = {
                name: 'John Doe',
                // Missing email and password
            };

            // Act
            const response = await request(app)
                .post('/api/auth/register')
                .send(incompleteUser)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('should return 400 error if email format is invalid', async () => {
            // Arrange
            const invalidUser = {
                name: 'John Doe',
                email: 'invalid-email', // Invalid email format
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/api/auth/register')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('should return 400 error if password is too short', async () => {
            // Arrange
            const weakPasswordUser = {
                name: 'John Doe',
                email: 'john@example.com',
                password: '123', // Too short
            };

            // Act
            const response = await request(app)
                .post('/api/auth/register')
                .send(weakPasswordUser)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login user with valid credentials and return 200 status with JWT token', async () => {
            // Arrange - First register a user
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData);

            // Act - Login with correct credentials
            const loginData = {
                email: 'john@example.com',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).toBeTruthy();
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', 'john@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });

        test('should return 401 error for invalid password', async () => {
            // Arrange - Register a user first
            const userData = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'correctpassword',
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData);

            // Act - Try to login with wrong password
            const loginData = {
                email: 'jane@example.com',
                password: 'wrongpassword',
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(401);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toMatch(/invalid.*credentials/i);
        });

        test('should return 401 error for non-existent user', async () => {
            // Arrange
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(401);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toMatch(/invalid.*credentials/i);
        });

        test('should return 400 error if email is missing', async () => {
            // Arrange
            const loginData = {
                // Missing email
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('should return 400 error if password is missing', async () => {
            // Arrange
            const loginData = {
                email: 'john@example.com',
                // Missing password
            };

            // Act
            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('JWT token should be valid and contain user ID', async () => {
            // Arrange - Register and login
            const userData = {
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData);

            const loginData = {
                email: 'testuser@example.com',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            // Assert - Token should exist and be a string
            expect(response.body.token).toBeDefined();
            expect(typeof response.body.token).toBe('string');
            expect(response.body.token.length).toBeGreaterThan(20);
        });
    });
});
