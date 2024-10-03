# Natours API - Backend

This project is a backend API for the **Natours** tour booking application, providing users with the ability to view, book, and manage tours. It is built using modern Node.js practices with Express and MongoDB, ensuring scalability, security, and performance.

## Features

- **User Authentication and Authorization:** Sign up, log in, password reset, and role-based access control.
- **Tour Management:** Add, update, delete, and view tours.
- **User Management:** Update user details, deactivate accounts.
- **Booking Management:** Book tours, process payments (if integrated), and manage booking history.
- **Advanced Filtering, Sorting, and Pagination:** Query functionality for listing tours based on specific criteria.
- **Data Validation and Error Handling:** Robust validation using tools like `express-validator` and custom error handling.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast and minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing tour, user, and booking information.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: Secure authentication with JSON Web Tokens.
- **Bcrypt**: Secure password hashing.

## Installation

1. Clone the repository:
   git clone https://github.com/Haleem200/natours-api.git

2. Install Dependencies: Make sure you have Node.js and MongoDB installed on your machine.
   npm install

3. 3- Set Up the Environment Variables: Create a .env file in the root directory and configure the following variables:
   NODE_ENV=development
   PORT=3000
   DATABASE=mongodb://localhost:27017/natours
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   STRIPTE_SECRET_KEY=your_stripe_secret_key

4. Start the development server:
   npm start
   The server will run on http://localhost:3000.
