# Natours API 🌍

A comprehensive RESTful API for a tour booking platform built with Node.js, Express, and MongoDB. This backend application provides secure authentication, tour management, booking functionality, and payment processing capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - User registration and login with JWT tokens
  - Password reset functionality via email
  - Role-based access control (user, guide, lead-guide, admin)
  - Secure password hashing with bcrypt

- **Tour Management**
  - CRUD operations for tours
  - Advanced filtering, sorting, and pagination
  - Geospatial data support for tour locations
  - Image upload and processing for tour photos
  - Tour statistics and analytics

- **Booking System**
  - Secure payment processing with Stripe
  - Booking management and history
  - Tour availability tracking

- **Review System**
  - User reviews and ratings for tours
  - Automatic calculation of average ratings
  - Review management with proper authorization

- **User Management**
  - User profile management
  - Photo upload and processing
  - Account deactivation
  - Admin user management

### Security Features
- **Rate Limiting** - Prevents API abuse
- **Data Sanitization** - Protection against NoSQL injection attacks
- **XSS Protection** - Prevents cross-site scripting attacks
- **HTTP Security Headers** - Enhanced security with Helmet.js
- **Parameter Pollution Prevention** - HPP middleware protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Image Processing**: Sharp
- **Payment Processing**: Stripe
- **Email Service**: Nodemailer
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, hpp

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/natours-api.git
   cd natours-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `config.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database
   DATABASE=mongodb://localhost:27017/natours
   DATABASE_PASSWORD=your_database_password
   
   # JWT
   JWT_SECRET=your-super-secure-jwt-secret-key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   
   # Email Configuration (for password reset)
   EMAIL_HOST=your-email-host
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email-username
   EMAIL_PASSWORD=your-email-password
   
   # Stripe (for payments)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm start
   
   # Production mode
   npm run start:prod
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints
- `POST /users/signup` - User registration
- `POST /users/signin` - User login
- `POST /users/forgotPassword` - Request password reset
- `PATCH /users/resetPassword/:token` - Reset password with token

### Tour Endpoints
- `GET /tours` - Get all tours (with filtering, sorting, pagination)
- `GET /tours/:id` - Get single tour
- `POST /tours` - Create new tour (admin/lead-guide only)
- `PATCH /tours/:id` - Update tour (admin/lead-guide only)
- `DELETE /tours/:id` - Delete tour (admin/lead-guide only)
- `GET /tours/top-5-cheap` - Get top 5 cheapest tours
- `GET /tours/tour-stats` - Get tour statistics
- `GET /tours/monthly-plan/:year` - Get monthly tour plan

### User Endpoints
- `GET /users/me` - Get current user data
- `PATCH /users/updateMe` - Update current user data
- `DELETE /users/deleteMe` - Deactivate current user account
- `PATCH /users/update-my-password` - Update current user password

### Review Endpoints
- `GET /tours/:tourId/reviews` - Get all reviews for a tour
- `POST /tours/:tourId/reviews` - Create review for a tour
- `GET /reviews/:id` - Get single review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Booking Endpoints
- `GET /bookings/checkout-session/:tourId` - Get Stripe checkout session
- `GET /bookings` - Get all bookings (admin only)
- `POST /bookings` - Create booking (admin only)
- `GET /bookings/:id` - Get single booking
- `PATCH /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Delete booking

## 🔍 Query Features

The API supports advanced querying capabilities:

### Filtering
```
GET /api/v1/tours?difficulty=easy&price[lte]=1500
```

### Sorting
```
GET /api/v1/tours?sort=-ratingsAverage,price
```

### Field Limiting
```
GET /api/v1/tours?fields=name,duration,difficulty,price
```

### Pagination
```
GET /api/v1/tours?page=2&limit=10
```

## 🏗️ Project Structure

```
natours-api/
├── controllers/          # Route handlers
│   ├── auth-controller.js
│   ├── booking-controller.js
│   ├── error-controller.js
│   ├── review-controller.js
│   ├── tour-controllers.js
│   └── user-controllers.js
├── models/              # Database models
│   ├── booking-model.js
│   ├── review-model.js
│   ├── tour-model.js
│   └── user-model.js
├── routes/              # Route definitions
│   ├── booking-routes.js
│   ├── review-routes.js
│   ├── tour-routes.js
│   └── user-routes.js
├── utils/               # Utility functions
│   ├── APIFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
├── app.js              # Express app configuration
├── server.js           # Server startup
└── package.json        # Dependencies and scripts
```
---
