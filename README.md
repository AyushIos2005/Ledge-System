Ledger System

A backend service for a banking/financial ledger application built with Node.js, Express.js, MongoDB, and Mongoose.

The project focuses on secure user authentication, account/user management, and ledger-oriented backend operations through REST APIs.

Features

User registration and login

JWT-based authentication

HTTP cookie and Bearer-token authentication support

Password hashing with bcrypt

Protected API routes

MongoDB persistence with Mongoose

Email integration using Nodemailer and Gmail OAuth2

OTP/email-based account workflows

Centralized authentication middleware

Environment-based configuration

RESTful API architecture

Validation and structured error responses

Tech Stack

Technology

Purpose

Node.js

Backend runtime

Express.js

REST API framework

MongoDB

Database

Mongoose

ODM

JWT

Authentication

bcrypt/bcryptjs

Password hashing

Nodemailer

Email delivery

Gmail OAuth2

Secure email authentication

dotenv

Environment configuration

Postman

API testing

Git/GitHub

Version control

Project Structure

Ledger-System/
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middlewares/
    │   ├── services/
    │   └── app.js
    ├── server.js
    ├── package.json
    └── .env

The exact folders may vary as the project evolves.

Getting Started

1. Clone the repository

git clone https://github.com/AyushIos2005/Ledge-System.git
cd Ledge-System

2. Open the backend

cd backend

3. Install dependencies

npm install

4. Configure environment variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

USERMAIL=your_email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

Never commit .env to GitHub.

Running the Server

Development:

npm run dev

Production:

npm start

Example local server:

http://localhost:5000

Authentication

The API uses JWT authentication.

A protected request can provide the token through an HTTP cookie:

token=<JWT>

or through the Authorization header:

Authorization: Bearer <JWT>

Example:

GET /api/...
Authorization: Bearer eyJhbGciOi...

The authentication middleware:

Reads the token from the cookie or Authorization header.

Verifies the JWT.

Extracts the authenticated user ID.

Loads the user from MongoDB.

Attaches the authenticated user to req.user.

Rejects missing or invalid authentication with HTTP 401.

API Documentation

Authentication

Typical authentication operations include:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/logout

Keep endpoint paths synchronized with the route files in the current backend. The API implementation is the source of truth.

Example Registration Request

POST /api/auth/register
Content-Type: application/json

{
  "name": "Ayush Verma",
  "email": "ayush@example.com",
  "password": "Password@123"
}

Example Login Request

POST /api/auth/login
Content-Type: application/json

{
  "email": "ayush@example.com",
  "password": "Password@123"
}

HTTP Status Codes

Status

Meaning

200

Request successful

201

Resource created

400

Invalid request or validation error

401

Authentication required/invalid

403

Access forbidden

404

Resource not found

409

Resource conflict

500

Internal server error

Security

The project is designed around common backend security practices:

Passwords should never be stored in plain text.

JWT secrets must be stored in environment variables.

Database credentials must not be committed.

Authentication middleware protects private endpoints.

Input validation should be applied before database operations.

Sensitive authentication cookies should use appropriate httpOnly, secure, and sameSite settings in production.

Production deployments should use HTTPS.

Login, OTP, password-reset, and other sensitive endpoints should have rate limiting.

Error responses should avoid exposing secrets or internal implementation details.

Banking / Ledger Domain

A ledger-oriented banking backend generally represents financial activity as immutable transaction records.

A typical transaction concept is:

{
  "accountId": "ACCOUNT_ID",
  "type": "credit",
  "amount": 5000,
  "description": "Salary",
  "reference": "TXN_REFERENCE",
  "createdAt": "2026-09-28T10:30:00.000Z"
}

For financial operations, the backend should enforce:

Positive monetary amounts

Valid account ownership

Atomic database updates

Transaction consistency

Unique transaction/reference identifiers

Authorization before account access

Audit-friendly transaction records

Prevention of unauthorized balance modification

Financial calculations should use an appropriate representation for monetary values rather than relying blindly on JavaScript floating-point arithmetic.

API Testing

Use Postman to test the backend.

Recommended testing flow:

Register
   ↓
Verify account / OTP
   ↓
Login
   ↓
Receive authentication token
   ↓
Call protected APIs
   ↓
Logout

For cookie-based authentication, enable cookie handling in the API client.

Environment Variables

Do not publish actual credentials.

Recommended .gitignore:

node_modules/
.env
.env.*
!.env.example
*.log
coverage/
dist/
build/

Create an .env.example containing variable names only:

PORT=
MONGO_URI=
JWT_SECRET=

USERMAIL=
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=

Production Checklist

Before deploying:

Use a strong JWT_SECRET

Keep .env outside version control

Enable HTTPS

Configure secure cookies

Restrict CORS to trusted frontend origins

Add rate limiting

Validate all request bodies

Add centralized error handling

Add request logging

Add database indexes

Add health checks

Add automated API tests

Configure MongoDB backups

Monitor authentication failures

Audit financial transactions

Development

Useful commands:

npm install
npm run dev
npm start

Run the API locally and test endpoints with Postman.

Contributing

Fork the repository.

Create a feature branch.

git checkout -b feature/your-feature

Make your changes.

Test the API.

Commit your changes.

git add .
git commit -m "Add your feature"

Push the branch.

git push origin feature/your-feature

Open a Pull Request.

License

This project is licensed under the MIT License.

Author

Ayush Verma

Backend Developer / Computer Science Student

GitHub: AyushIos2005

Disclaimer

This project is intended for software development and educational purposes. It is not, by itself, a production banking platform or a substitute for the security, compliance, auditing, regulatory controls, and operational requirements required by real financial institutions.
