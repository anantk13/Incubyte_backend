# 🧪 Testing Environment Setup - Complete Guide

## ✅ Overview

The testing environment is now fully configured for **Test-Driven Development (TDD)** using:
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for isolated testing

---

## 📦 Installed Dependencies

### Testing Dependencies (DevDependencies)
```json
{
  "jest": "^29.7.0",
  "supertest": "^7.1.4",
  "mongodb-memory-server": "^latest"
}
```

### Installation Command Used
```bash
npm install --save-dev jest supertest mongodb-memory-server
```

---

## 📁 Testing File Structure

```
backend/tests/
├── db-handler.js           ✅ MongoDB Memory Server utilities
├── setup.js                ✅ Global test configuration
├── example.test.js         ✅ Example test file (for reference)
└── README.md               ✅ Testing documentation
```

---

## 🔧 Configuration Files

### 1. `jest.config.js` ✅

**Purpose**: Configure Jest testing framework

**Key Settings**:
```javascript
{
  testEnvironment: 'node',           // Node.js environment
  testTimeout: 30000,                // 30 seconds (for MongoDB operations)
  maxWorkers: 1,                     // Run tests serially (avoid DB conflicts)
  coverageThreshold: {               // Minimum 70% coverage
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  forceExit: true,
  detectOpenHandles: true
}
```

**Features**:
- ✅ Node environment for backend testing
- ✅ 30-second timeout for database operations
- ✅ Serial test execution (prevents DB conflicts)
- ✅ 70% code coverage requirement
- ✅ Automatic setup file loading
- ✅ Memory leak detection
- ✅ Coverage reports (text, lcov, html)

---

### 2. `tests/setup.js` ✅

**Purpose**: Global test configuration and utilities

**Features**:
- ✅ Sets test environment variables
- ✅ Configures test timeout
- ✅ Provides global test utilities
- ✅ Mock data generators

**Global Utilities Available**:
```javascript
// Create single mock sweet
const sweet = global.testUtils.createMockSweet({
  name: 'Custom Sweet',
  price: 15
});

// Create multiple mock sweets
const sweets = global.testUtils.createMockSweets(5);

// Wait for async operations
await global.testUtils.wait(100);
```

---

### 3. `tests/db-handler.js` ✅

**Purpose**: MongoDB Memory Server management

**Key Functions**:

#### `connect()`
Connects to in-memory MongoDB instance
```javascript
await dbHandler.connect();
```

#### `closeDatabase()`
Closes connection and stops MongoDB Memory Server
```javascript
await dbHandler.closeDatabase();
```

#### `clearDatabase()`
Removes all data from all collections
```javascript
await dbHandler.clearDatabase();
```

#### `getConnectionStatus()`
Returns current connection state
```javascript
const status = dbHandler.getConnectionStatus();
// Returns: 'connected', 'disconnected', 'connecting', or 'disconnecting'
```

#### `getDbStats()`
Returns document count for each collection
```javascript
const stats = await dbHandler.getDbStats();
// Returns: { sweets: 5, categories: 3 }
```

---

## 🎯 TDD Workflow with Testing Setup

### Step 1: Write Test First (RED) 🔴

```javascript
const dbHandler = require('./db-handler');
const Sweet = require('../models/Sweet');

describe('Sweet Model', () => {
  // Setup: Connect to in-memory DB
  beforeAll(async () => {
    await dbHandler.connect();
  });

  // Cleanup: Clear DB after each test
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  // Teardown: Close DB connection
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  // RED: This test will fail (model doesn't exist yet)
  test('should create a new sweet', async () => {
    const sweetData = {
      name: 'Chocolate Bar',
      price: 5,
      quantity: 100,
      category: 'Chocolate'
    };

    const sweet = await Sweet.create(sweetData);

    expect(sweet.name).toBe('Chocolate Bar');
    expect(sweet.price).toBe(5);
    expect(sweet.quantity).toBe(100);
  });
});
```

### Step 2: Run Test (Confirm RED) 🔴

```bash
npm test
```

**Expected**: Test fails because Sweet model doesn't exist

### Step 3: Write Minimal Code (GREEN) 🟢

Create the Sweet model to make the test pass

### Step 4: Refactor (REFACTOR) 🔵

Improve code while keeping tests green

---

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- tests/sweet.test.js
```

### Run Tests Without Watch Mode
```bash
npm test -- --watchAll=false
```

---

## 📊 Test Structure Template

```javascript
const dbHandler = require('./db-handler');
const request = require('supertest');
const app = require('../server');
const ModelName = require('../models/ModelName');

describe('Feature Name', () => {
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

  describe('Specific functionality', () => {
    test('should do something specific', async () => {
      // Arrange - Setup test data
      const testData = { /* ... */ };

      // Act - Execute the function
      const result = await someFunction(testData);

      // Assert - Verify the result
      expect(result).toBeDefined();
      expect(result.property).toBe(expectedValue);
    });
  });
});
```

---

## 🧪 Testing Best Practices

### 1. **Isolation**
- ✅ Each test is independent
- ✅ Clear database between tests
- ✅ No shared state between tests

### 2. **AAA Pattern**
- **Arrange**: Set up test data
- **Act**: Execute the function
- **Assert**: Verify the result

### 3. **Descriptive Names**
```javascript
// Good ✅
test('should create a sweet with valid data', async () => { ... });

// Bad ❌
test('test1', async () => { ... });
```

### 4. **One Assertion Per Test** (when possible)
Focus each test on a single behavior

### 5. **Use beforeAll/afterAll for Setup/Teardown**
```javascript
beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());
```

---

## 🔍 Testing API Endpoints with Supertest

```javascript
const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');

describe('Sweet API Endpoints', () => {
  beforeAll(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => await dbHandler.closeDatabase());

  test('GET /api/sweets should return all sweets', async () => {
    // Arrange
    const sweet = await Sweet.create({
      name: 'Chocolate',
      price: 5,
      quantity: 100
    });

    // Act
    const response = await request(app)
      .get('/api/sweets')
      .expect('Content-Type', /json/)
      .expect(200);

    // Assert
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Chocolate');
  });

  test('POST /api/sweets should create a new sweet', async () => {
    // Arrange
    const sweetData = {
      name: 'Candy',
      price: 3,
      quantity: 50
    };

    // Act
    const response = await request(app)
      .post('/api/sweets')
      .send(sweetData)
      .expect('Content-Type', /json/)
      .expect(201);

    // Assert
    expect(response.body.name).toBe('Candy');
    expect(response.body.price).toBe(3);
  });
});
```

---

## 📈 Code Coverage

### View Coverage Report
```bash
npm test -- --coverage
```

### Coverage Output
```
---------------------------|---------|----------|---------|---------|
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   85.71 |    83.33 |   88.89 |   85.71 |
 models                    |   90.00 |    85.00 |   92.00 |   90.00 |
  Sweet.js                 |   90.00 |    85.00 |   92.00 |   90.00 |
 controllers               |   82.50 |    80.00 |   85.00 |   82.50 |
  sweetController.js       |   82.50 |    80.00 |   85.00 |   82.50 |
---------------------------|---------|----------|---------|---------|
```

### Coverage Thresholds
- **Minimum**: 70% for all metrics
- **Target**: 80%+ for production code
- **Goal**: 90%+ for critical paths

---

## ✅ Verification Checklist

- [x] Jest installed and configured
- [x] Supertest installed
- [x] MongoDB Memory Server installed
- [x] jest.config.js configured
- [x] tests/setup.js created with utilities
- [x] tests/db-handler.js created
- [x] Example test file created
- [x] Test timeout set to 30 seconds
- [x] Coverage thresholds set to 70%
- [x] Serial test execution configured
- [x] Documentation created

---

## 🎓 Why MongoDB Memory Server?

### Benefits
1. **Isolation**: Tests don't affect production database
2. **Speed**: In-memory operations are faster
3. **Consistency**: Fresh database for each test run
4. **Portability**: No external MongoDB installation required
5. **CI/CD Friendly**: Works in any environment

### How It Works
1. Spins up a real MongoDB instance in memory
2. Provides a connection URI
3. Mongoose connects to this instance
4. Tests run against in-memory database
5. Database is destroyed after tests

---

## 🔜 Next Steps - Ready for TDD!

Now you can start implementing features using TDD:

1. **Write Test First** (RED 🔴)
   - Write a failing test
   - Run test to confirm it fails

2. **Write Code** (GREEN 🟢)
   - Write minimal code to pass test
   - Run test to confirm it passes

3. **Refactor** (REFACTOR 🔵)
   - Improve code quality
   - Ensure tests still pass

---

## 📝 Example Test Run

```bash
$ npm test

> backend@1.0.0 test
> jest --watchAll --verbose

🧪 Jest test environment configured
📊 Test timeout: 30 seconds
🌍 Environment: test

 PASS  tests/example.test.js
  Database Handler Example
    ✓ should connect to in-memory database (45ms)
    ✓ should return empty database stats initially (12ms)
    ✓ should clear database successfully (8ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.456s
```

---

## 📚 Additional Resources

### Jest Documentation
- [Jest Official Docs](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)

### Supertest Documentation
- [Supertest GitHub](https://github.com/visionmedia/supertest)

### MongoDB Memory Server
- [MongoDB Memory Server Docs](https://github.com/nodkz/mongodb-memory-server)

---

**🎉 TESTING ENVIRONMENT COMPLETE!**

**Ready to start Test-Driven Development!** 🚀
