# 🏗️ Backend Architecture - Sweet Shop Management System

## 📁 MVC Folder Structure

```
backend/
├── config/              ✅ Configuration files
│   ├── db.js           ✅ MongoDB connection with error handling
│   └── README.md       
├── controllers/         ✅ Business logic controllers
│   └── README.md       
├── models/              ✅ Mongoose schemas/models
│   └── README.md       
├── routes/              ✅ Express route definitions
│   └── README.md       
├── middleware/          ✅ Custom middleware functions
│   └── README.md       
├── tests/               ✅ Jest test files
│   ├── setup.js        ✅ Test configuration
│   └── README.md       
├── .env                 ✅ Environment variables
├── server.js            ✅ Main application entry point
├── package.json         ✅ Dependencies and scripts
└── jest.config.js       ✅ Jest testing configuration
```

---

## 🔧 Configuration Files

### `config/db.js` ✅
**Purpose**: MongoDB database connection with robust error handling

**Features**:
- ✅ Async/await connection with Mongoose
- ✅ Environment variable support
- ✅ Connection timeout configuration
- ✅ Comprehensive error handling:
  - MongoServerError
  - MongoNetworkError
  - MongooseServerSelectionError
- ✅ Connection event listeners (connected, error, disconnected)
- ✅ Graceful shutdown on SIGINT
- ✅ Helper functions:
  - `connectDB()` - Connect to database
  - `disconnectDB()` - Disconnect from database
  - `getConnectionStatus()` - Get connection state

**Error Handling**:
```javascript
- Network errors (MongoDB not running)
- Server selection errors (Atlas connection issues)
- Authentication errors
- Timeout errors
- Graceful process exit on failure
```

---

## 🚀 Server Configuration

### `server.js` ✅
**Purpose**: Main Express application setup

**Features**:
- ✅ Express app initialization
- ✅ CORS middleware
- ✅ JSON body parser
- ✅ URL-encoded body parser
- ✅ Database connection
- ✅ Health check endpoint (`/api/health`)
- ✅ Welcome endpoint (`/`)
- ✅ 404 handler
- ✅ Global error handler
- ✅ Unhandled rejection handler
- ✅ Environment-specific error details

**Endpoints**:
```
GET  /                - Welcome message
GET  /api/health      - Health check
```

---

## 🧪 Testing Configuration

### `jest.config.js` ✅
**Purpose**: Jest testing framework configuration

**Features**:
- ✅ Node test environment
- ✅ Test pattern matching
- ✅ Code coverage collection
- ✅ Coverage thresholds (70% minimum)
- ✅ Setup files configuration
- ✅ Verbose output
- ✅ Mock cleanup between tests
- ✅ 10s test timeout
- ✅ Force exit and detect open handles

### `tests/setup.js` ✅
**Purpose**: Global test setup and utilities

**Features**:
- ✅ Test environment variables
- ✅ Separate test database (sweetshop_test)
- ✅ Test port configuration (5001)
- ✅ Global test utilities
- ✅ Mock data helpers

---

## 🎯 MVC Architecture Pattern

### **Models** (Data Layer)
- Define database schemas using Mongoose
- Handle data validation
- Define relationships between collections
- Example: `Sweet.js`, `Category.js`, `User.js`

### **Controllers** (Business Logic Layer)
- Process incoming requests
- Interact with models
- Implement business rules
- Return responses
- Example: `sweetController.js`

### **Routes** (Presentation Layer)
- Define API endpoints
- Map HTTP methods to controllers
- Apply middleware
- Example: `sweetRoutes.js`

### **Middleware** (Cross-cutting Concerns)
- Request validation
- Authentication/Authorization
- Error handling
- Logging
- Rate limiting

---

## 🔐 Environment Variables

### `.env` Configuration
```env
PORT=5000                                          # Server port
MONGODB_URI=mongodb://localhost:27017/sweetshop   # MongoDB connection
NODE_ENV=development                               # Environment
```

### Test Environment
```env
NODE_ENV=test
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sweetshop_test
```

---

## 📝 NPM Scripts

```bash
npm start       # Run production server (node server.js)
npm run dev     # Run development server (nodemon server.js)
npm test        # Run Jest tests with watch mode
```

---

## 🔄 Database Connection Flow

```
1. Load environment variables (.env)
2. Import connectDB from config/db.js
3. Call connectDB() in server.js
4. Mongoose attempts connection with options
5. Success: Log connection details
6. Failure: Log detailed error and exit
7. Setup event listeners for connection lifecycle
8. Setup graceful shutdown on SIGINT
```

---

## ✅ Error Handling Strategy

### Database Errors
- **Network Error**: MongoDB not running → Clear message + exit
- **Server Selection Error**: Can't connect to cluster → Check connection string
- **Authentication Error**: Invalid credentials → Check .env file
- **Timeout Error**: Connection timeout → Check network/firewall

### Application Errors
- **404 Errors**: Route not found → JSON response with path
- **500 Errors**: Internal errors → JSON response with stack (dev only)
- **Unhandled Rejections**: Promise rejections → Log and graceful shutdown

---

## 🧪 TDD Workflow

### Test-First Development
1. **🔴 RED**: Write failing test
2. **🟢 GREEN**: Write minimal code to pass
3. **🔵 REFACTOR**: Improve code while keeping tests green

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeAll(async () => {
    // Setup (connect to test DB)
  });

  afterAll(async () => {
    // Cleanup (disconnect from test DB)
  });

  test('should do something specific', async () => {
    // Arrange - Setup test data
    // Act - Execute the function
    // Assert - Verify the result
  });
});
```

---

## 🚀 Next Steps

1. ✅ Backend structure created
2. ✅ Database configuration complete
3. ✅ Server setup complete
4. ✅ Testing infrastructure ready
5. ⏳ Ready to create first feature using TDD

---

## 📊 Current Status

### Completed ✅
- [x] MVC folder structure
- [x] Database connection with error handling
- [x] Express server setup
- [x] Jest testing configuration
- [x] Environment configuration
- [x] Health check endpoints
- [x] Error handling middleware
- [x] Graceful shutdown handling

### Ready For ⏳
- [ ] Sweet model (TDD)
- [ ] Sweet controller (TDD)
- [ ] Sweet routes (TDD)
- [ ] CRUD operations (TDD)
- [ ] Validation middleware (TDD)

---

**🎉 Backend MVC Architecture Complete!**

**Ready for TDD feature development!**
