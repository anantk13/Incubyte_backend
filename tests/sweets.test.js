/**
 * Sweets/Inventory Tests
 * 
 * Test suite for sweet inventory management
 * Following TDD approach - RED, GREEN, REFACTOR
 */

const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

/**
 * Helper function to generate JWT token for testing
 */
const generateTestToken = (userId, role = 'user') => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
    );
};

describe('Sweets API', () => {
    let adminUser;
    let normalUser;
    let adminToken;
    let userToken;

    // Connect to in-memory database before all tests
    beforeAll(async () => {
        await dbHandler.connect();

        // Create admin user
        adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@sweetshop.com',
            password: 'admin123',
            role: 'admin',
        });

        // Create normal user
        normalUser = await User.create({
            name: 'Normal User',
            email: 'user@sweetshop.com',
            password: 'user123',
            role: 'user',
        });

        // Generate tokens
        adminToken = generateTestToken(adminUser._id, 'admin');
        userToken = generateTestToken(normalUser._id, 'user');
    });

    // Clear sweets collection after each test
    afterEach(async () => {
        // Only clear sweets, keep users
        if (Sweet && Sweet.collection) {
            await Sweet.deleteMany({});
        }
    });

    // Close database connection after all tests
    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    describe('GET /api/sweets', () => {
        test('should return empty array when no sweets exist (public access)', async () => {
            // Act
            const response = await request(app)
                .get('/api/sweets')
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });

        test('should return list of all sweets (public access)', async () => {
            // Arrange - Create some sweets
            await Sweet.create([
                {
                    name: 'Chocolate Bar',
                    category: 'Chocolate',
                    price: 5,
                    quantity: 100,
                    description: 'Delicious chocolate bar',
                },
                {
                    name: 'Gummy Bears',
                    category: 'Candy',
                    price: 3,
                    quantity: 50,
                    description: 'Colorful gummy bears',
                },
            ]);

            // Act
            const response = await request(app)
                .get('/api/sweets')
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toHaveProperty('name');
            expect(response.body.data[0]).toHaveProperty('price');
            expect(response.body.data[0]).toHaveProperty('quantity');
        });

        test('should not require authentication to view sweets', async () => {
            // Act - Request without token
            const response = await request(app)
                .get('/api/sweets')
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/sweets', () => {
        test('should allow admin user to add a new sweet', async () => {
            // Arrange
            const sweetData = {
                name: 'Lollipop',
                category: 'Candy',
                price: 2,
                quantity: 200,
                description: 'Sweet lollipop',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect('Content-Type', /json/)
                .expect(201);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('name', 'Lollipop');
            expect(response.body.data).toHaveProperty('price', 2);
            expect(response.body.data).toHaveProperty('quantity', 200);
            expect(response.body.data).toHaveProperty('_id');
        });

        test('should fail with 403 if normal user tries to add a sweet', async () => {
            // Arrange
            const sweetData = {
                name: 'Unauthorized Sweet',
                category: 'Candy',
                price: 5,
                quantity: 100,
                description: 'This should not be created',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send(sweetData)
                .expect('Content-Type', /json/)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toMatch(/not authorized|forbidden|admin/i);
        });

        test('should fail with 401 if no token is provided', async () => {
            // Arrange
            const sweetData = {
                name: 'No Auth Sweet',
                category: 'Candy',
                price: 5,
                quantity: 100,
                description: 'No authentication',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .send(sweetData)
                .expect('Content-Type', /json/)
                .expect(401);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('should fail with 401 if invalid token is provided', async () => {
            // Arrange
            const sweetData = {
                name: 'Invalid Token Sweet',
                category: 'Candy',
                price: 5,
                quantity: 100,
                description: 'Invalid token',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', 'Bearer invalid-token-here')
                .send(sweetData)
                .expect('Content-Type', /json/)
                .expect(401);

            // Assert
            expect(response.body).toHaveProperty('success', false);
        });

        test('should validate required fields when adding sweet', async () => {
            // Arrange - Missing required fields
            const invalidSweet = {
                name: 'Incomplete Sweet',
                // Missing category, price, quantity
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidSweet)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        test('should validate price is a positive number', async () => {
            // Arrange
            const invalidSweet = {
                name: 'Negative Price Sweet',
                category: 'Candy',
                price: -5, // Invalid negative price
                quantity: 100,
                description: 'Invalid price',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidSweet)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
        });

        test('should validate quantity is a non-negative number', async () => {
            // Arrange
            const invalidSweet = {
                name: 'Negative Quantity Sweet',
                category: 'Candy',
                price: 5,
                quantity: -10, // Invalid negative quantity
                description: 'Invalid quantity',
            };

            // Act
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidSweet)
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        test('should decrease quantity by 1 when purchasing a sweet', async () => {
            // Arrange - Create a sweet with quantity 10
            const sweet = await Sweet.create({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 5,
                quantity: 10,
                description: 'Delicious chocolate',
            });

            // Act - Purchase 1 sweet
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 1 })
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('quantity', 9);
            expect(response.body.data).toHaveProperty('inStock', true);
        });

        test('should decrease quantity by specified amount', async () => {
            // Arrange - Create a sweet with quantity 20
            const sweet = await Sweet.create({
                name: 'Gummy Bears',
                category: 'Gummy',
                price: 3,
                quantity: 20,
                description: 'Colorful gummy bears',
            });

            // Act - Purchase 5 sweets
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 5 })
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('quantity', 15);
        });

        test('should fail with 400 if quantity is 0 (out of stock)', async () => {
            // Arrange - Create a sweet with quantity 0
            const sweet = await Sweet.create({
                name: 'Out of Stock Sweet',
                category: 'Candy',
                price: 2,
                quantity: 0,
                description: 'No stock available',
            });

            // Act - Try to purchase
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 1 })
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toMatch(/insufficient|available/i);
        });

        test('should fail with 400 if requested quantity exceeds available quantity', async () => {
            // Arrange - Create a sweet with quantity 5
            const sweet = await Sweet.create({
                name: 'Limited Stock Sweet',
                category: 'Candy',
                price: 4,
                quantity: 5,
                description: 'Limited stock',
            });

            // Act - Try to purchase 10 (more than available)
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 10 })
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toMatch(/insufficient|only.*5.*available/i);
        });

        test('should fail with 404 if sweet does not exist', async () => {
            // Arrange - Use a non-existent ID
            const fakeId = '507f1f77bcf86cd799439011';

            // Act
            const response = await request(app)
                .post(`/api/sweets/${fakeId}/purchase`)
                .send({ quantity: 1 })
                .expect('Content-Type', /json/)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toMatch(/not found/i);
        });

        test('should update inStock status to false when quantity reaches 0', async () => {
            // Arrange - Create a sweet with quantity 1
            const sweet = await Sweet.create({
                name: 'Last One Sweet',
                category: 'Candy',
                price: 3,
                quantity: 1,
                description: 'Last one in stock',
            });

            // Act - Purchase the last one
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 1 })
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body.data).toHaveProperty('quantity', 0);
            expect(response.body.data).toHaveProperty('inStock', false);
        });

        test('should use atomic update to prevent race conditions', async () => {
            // Arrange - Create a sweet with quantity 10
            const sweet = await Sweet.create({
                name: 'Concurrent Test Sweet',
                category: 'Candy',
                price: 5,
                quantity: 10,
                description: 'Testing concurrent purchases',
            });

            // Act - Make multiple concurrent purchase requests
            const purchases = [
                request(app).post(`/api/sweets/${sweet._id}/purchase`).send({ quantity: 3 }),
                request(app).post(`/api/sweets/${sweet._id}/purchase`).send({ quantity: 2 }),
                request(app).post(`/api/sweets/${sweet._id}/purchase`).send({ quantity: 4 }),
            ];

            const responses = await Promise.all(purchases);

            // Assert - All should succeed
            responses.forEach(response => {
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            // Verify final quantity is correct (10 - 3 - 2 - 4 = 1)
            const updatedSweet = await Sweet.findById(sweet._id);
            expect(updatedSweet.quantity).toBe(1);
        });

        test('should default to quantity 1 if not specified', async () => {
            // Arrange
            const sweet = await Sweet.create({
                name: 'Default Quantity Sweet',
                category: 'Candy',
                price: 2,
                quantity: 10,
                description: 'Testing default quantity',
            });

            // Act - Purchase without specifying quantity
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({}) // No quantity specified
                .expect('Content-Type', /json/)
                .expect(200);

            // Assert
            expect(response.body.data).toHaveProperty('quantity', 9);
        });

        test('should validate quantity is a positive integer', async () => {
            // Arrange
            const sweet = await Sweet.create({
                name: 'Validation Test Sweet',
                category: 'Candy',
                price: 3,
                quantity: 10,
                description: 'Testing validation',
            });

            // Act - Try to purchase with invalid quantity
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: -1 })
                .expect('Content-Type', /json/)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toMatch(/positive integer/i);
        });

        test('should not require authentication for purchase', async () => {
            // Arrange
            const sweet = await Sweet.create({
                name: 'Public Purchase Sweet',
                category: 'Candy',
                price: 2,
                quantity: 10,
                description: 'Public can purchase',
            });

            // Act - Purchase without token
            const response = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .send({ quantity: 1 })
                .expect(200);

            // Assert
            expect(response.body.success).toBe(true);
        });
    });
});

