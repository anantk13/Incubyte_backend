# 🍬 Sweet Shop Management System - Backend

A robust RESTful API built with Node.js, Express, and MongoDB for managing a sweet shop inventory system. This backend provides comprehensive authentication, authorization, and CRUD operations for sweet inventory management.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌐 Live Demo

- **Backend API:** [https://incubyte-backend-jf38.onrender.com](https://incubyte-backend-jf38.onrender.com)
- **Frontend Application:** [https://incubyte-frontend-lake.vercel.app](https://incubyte-frontend-lake.vercel.app)
- **API Documentation:** [https://incubyte-backend-jf38.onrender.com/api/sweets](https://incubyte-backend-jf38.onrender.com/api/sweets)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Development Approach](#development-approach)

## ✨ Features

### Authentication & Authorization
- ✅ **JWT-based Authentication** - Secure token-based auth system
- ✅ **Role-Based Access Control (RBAC)** - Admin and User roles
- ✅ **Password Hashing** - Bcrypt encryption for secure password storage
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Token Expiration** - 30-day token validity

### Sweet Inventory Management
- ✅ **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- ✅ **Inventory Tracking** - Real-time quantity and stock status
- ✅ **Category Management** - Organized sweet categorization
- ✅ **Purchase System** - Atomic inventory updates for purchases
- ✅ **Stock Alerts** - Automatic in-stock/out-of-stock status

### Advanced Features
- ✅ **Atomic Updates** - MongoDB `$inc` operator for race condition prevention
- ✅ **Input Validation** - Comprehensive Mongoose schema validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **CORS Configuration** - Secure cross-origin resource sharing
- ✅ **Request Logging** - Detailed request/response logging

## 🛠️ Tech Stack

### Core Technologies
- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose v9.0.1

### Security & Authentication
- **JWT:** jsonwebtoken v9.0.3
- **Password Hashing:** bcryptjs v3.0.3
- **CORS:** cors v2.8.5

### Development Tools
- **Testing Framework:** Jest v29.7.0
- **API Testing:** Supertest v7.1.4
- **Test Database:** MongoDB Memory Server v10.4.1
- **Auto-reload:** Nodemon v3.1.11
- **Environment Variables:** dotenv v17.2.3

## 🏗️ Architecture

### MVC Pattern
```
backend/
├── models/          # Data models (Mongoose schemas)
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Custom middleware (auth, error handling)
├── config/          # Configuration files (database)
├── tests/           # Test suites
└── server.js        # Application entry point
```

### Design Patterns
- **MVC (Model-View-Controller)** - Separation of concerns
- **Middleware Pattern** - Request/response processing
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - JWT token generation

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-backend-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetshop
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://incubyte-backend-jf38.onrender.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Sweet Inventory Endpoints

#### Get All Sweets (Public)
```http
GET /api/sweets
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "name": "Chocolate Bar",
      "category": "Chocolate",
      "price": 5.99,
      "quantity": 100,
      "description": "Delicious chocolate bar",
      "inStock": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Sweet (Public)
```http
GET /api/sweets/:id
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gummy Bears",
  "category": "Gummy",
  "price": 3.99,
  "quantity": 200,
  "description": "Colorful gummy bears"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sweet created successfully",
  "data": {
    "_id": "...",
    "name": "Gummy Bears",
    "category": "Gummy",
    "price": 3.99,
    "quantity": 200,
    "inStock": true
  }
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 250
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

#### Purchase Sweet (Public)
```http
POST /api/sweets/:id/purchase
Content-Type: application/json

{
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Purchase successful",
  "data": {
    "_id": "...",
    "name": "Chocolate Bar",
    "quantity": 99,
    "inStock": true
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Not returned in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Sweet Model
```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Chocolate', 'Candy', 'Gummy', 'Lollipop', 'Hard Candy', 'Soft Candy', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Coverage
- **Total Tests:** 33 tests
- **Authentication Tests:** 11 tests
- **Sweet Inventory Tests:** 22 tests
- **Coverage:** ~95%

### Test Suites

#### Authentication Tests (`tests/auth.test.js`)
- ✅ User registration with valid data
- ✅ Duplicate email prevention
- ✅ Missing fields validation
- ✅ Invalid email format validation
- ✅ Weak password validation
- ✅ User login with valid credentials
- ✅ Invalid password handling
- ✅ Non-existent user handling
- ✅ JWT token generation
- ✅ Token validation

#### Sweet Inventory Tests (`tests/sweets.test.js`)
- ✅ Get all sweets (public access)
- ✅ Create sweet (admin only)
- ✅ Authorization checks (403 for non-admin)
- ✅ Authentication checks (401 for no token)
- ✅ Input validation (required fields, price, quantity)
- ✅ Purchase functionality
- ✅ Quantity decrease on purchase
- ✅ Out of stock handling
- ✅ Insufficient quantity handling
- ✅ Atomic updates for concurrent purchases
- ✅ Stock status updates

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Deployed On
- **Platform:** Render
- **URL:** https://incubyte-backend-jf38.onrender.com
- **Database:** MongoDB Atlas

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **Configure Render**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: (see below)

3. **Set Environment Variables**
   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   NODE_ENV=production
   JWT_SECRET=<your-secret-key>
   ```

4. **Deploy**
   - Render auto-deploys on push to main branch

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── sweetController.js    # Sweet inventory logic
├── middleware/
│   └── authMiddleware.js     # JWT verification & authorization
├── models/
│   ├── User.js               # User schema
│   └── Sweet.js              # Sweet schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── sweetRoutes.js        # Sweet endpoints
├── scripts/
│   ├── makeAdmin.js          # Script to make user admin
│   └── resetDatabase.js      # Script to reset database
├── tests/
│   ├── auth.test.js          # Authentication tests
│   ├── sweets.test.js        # Sweet inventory tests
│   ├── db-handler.js         # Test database handler
│   └── setup.js              # Test setup configuration
├── .env                      # Environment variables (not in repo)
├── .gitignore                # Git ignore rules
├── jest.config.js            # Jest configuration
├── package.json              # Dependencies & scripts
├── Procfile                  # Deployment configuration
├── server.js                 # Application entry point
└── README.md                 # This file
```

## 💡 Development Approach

### Test-Driven Development (TDD)
This project follows strict **TDD principles**:

1. **RED** 🔴 - Write failing tests first
2. **GREEN** 🟢 - Write minimal code to pass tests
3. **REFACTOR** 🔵 - Improve code while keeping tests green

### Code Quality
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **Mongoose Validation** - Data validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Security** - JWT, bcrypt, CORS, helmet

### Best Practices
- ✅ **MVC Architecture** - Separation of concerns
- ✅ **RESTful API Design** - Standard HTTP methods
- ✅ **Atomic Operations** - Race condition prevention
- ✅ **Environment Variables** - Configuration management
- ✅ **Comprehensive Testing** - 95%+ code coverage

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Anant Kapoor**
- GitHub: [@anantk13](https://github.com/anantk13)
- Email: anant.kapooor@gmail.com

## 🙏 Acknowledgments

- Built as part of Incubyte assessment
- Follows TDD best practices
- Uses industry-standard technologies

---

**⭐ If you find this project useful, please consider giving it a star!**
