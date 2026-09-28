# 💳 Ledger System — Banking Backend API

A secure and scalable **Banking / Ledger Backend API** built with **Node.js, Express.js, MongoDB, and JWT authentication**.

The project provides a backend foundation for user authentication, account management, transactions, and ledger-based financial operations.

## 🚀 Live Server

**Production API Server:**
[https://ledge-system.onrender.com](https://ledge-system.onrender.com?utm_source=chatgpt.com)

### Server Status

You can open the live server URL to verify that the backend is running.

```text
Server is Working properly
```

---

## ✨ Features

* 🔐 User Registration & Login
* 🔑 JWT Authentication
* 🍪 Cookie-based Authentication
* 🛡️ Protected Routes
* 👤 User Profile Management
* 🔒 Password Hashing
* 📧 Email Verification / Notifications
* 💰 Banking / Ledger Operations
* 🗄️ MongoDB Database
* 📦 Mongoose ODM
* 📮 Postman API Testing
* 🌐 Production Deployment with Render
* ⚙️ Environment Variable Configuration

---

## 🛠️ Tech Stack

| Technology        | Purpose               |
| ----------------- | --------------------- |
| Node.js           | Backend Runtime       |
| Express.js        | REST API Framework    |
| MongoDB           | Database              |
| Mongoose          | MongoDB ODM           |
| JWT               | Authentication        |
| bcrypt / bcryptjs | Password Hashing      |
| Nodemailer        | Email Service         |
| Gmail OAuth2      | Email Authentication  |
| dotenv            | Environment Variables |
| Postman           | API Testing           |
| Git & GitHub      | Version Control       |
| Render            | Deployment            |

---

## 📁 Project Structure

```text
Backend_LASER/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── note.md
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/AyushIos2005/Ledge-System.git
```

Move into the project:

```bash
cd Ledge-System/backend
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

USERMAIL=your_gmail_address

CLIENT_ID=your_google_client_id

CLIENT_SECRET=your_google_client_secret

REFRESH_TOKEN=your_google_refresh_token
```

> Never commit your `.env` file or expose your secret keys publicly.

---

## ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

Or:

```bash
npm start
```

The server should run on:

```text
http://localhost:5000
```

---

## 🌐 Production Server

The backend is deployed on Render:

[Live Ledger Server](https://ledge-system.onrender.com?utm_source=chatgpt.com)

You can use the deployed server as the base URL for API requests.

```text
https://ledge-system.onrender.com
```

Example:

```text
https://ledge-system.onrender.com/api/...
```

---

## 🔑 Authentication

The application uses **JWT-based authentication**.

The authentication middleware can receive the token through:

### Cookie

```text
token=<JWT_TOKEN>
```

### Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

Protected routes verify the JWT and load the authenticated user before allowing access.

---

## 📮 API Testing

You can test the APIs using **Postman**.

Recommended testing flow:

```text
Register
   ↓
Login
   ↓
Receive Authentication Token
   ↓
Access Protected Routes
   ↓
Perform Banking/Ledger Operations
   ↓
Logout
```

---

## 📊 Typical HTTP Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| `200`  | Request successful    |
| `201`  | Resource created      |
| `400`  | Bad request           |
| `401`  | Unauthorized          |
| `403`  | Forbidden             |
| `404`  | Resource not found    |
| `409`  | Conflict              |
| `500`  | Internal server error |

---

## 🔒 Security

The backend follows several security practices:

* Passwords are hashed before storage.
* JWT is used for authentication.
* Protected routes require authentication.
* Environment variables are used for sensitive configuration.
* MongoDB credentials are not hardcoded.
* Authentication tokens can be stored using HTTP cookies.
* Sensitive credentials should never be committed to GitHub.

---

## 💳 Ledger System Concept

The project is designed around a backend architecture suitable for a banking/ledger application.

A typical financial operation can follow:

```text
Authenticated User
       ↓
API Request
       ↓
Authentication Middleware
       ↓
Controller
       ↓
Business Logic
       ↓
MongoDB
       ↓
API Response
```

This architecture helps separate authentication, business logic, database operations, and API handling.

---

## 🧪 Development Tools

### VS Code

Recommended editor for development.

### Postman

Used for testing REST APIs.

### MongoDB

Used as the primary database.

### Git

Used for source-code version control.

---

## 🚀 Deployment

The backend is deployed using **Render**.

Production URL:

[https://ledge-system.onrender.com](https://ledge-system.onrender.com?utm_source=chatgpt.com)

GitHub Repository:

[Ledge-System GitHub Repository](https://github.com/AyushIos2005/Ledge-System?utm_source=chatgpt.com)

---

## 📌 Production Checklist

Before deploying a production version:

* [ ] Configure production MongoDB
* [ ] Set secure `JWT_SECRET`
* [ ] Configure Gmail OAuth2
* [ ] Add all environment variables to Render
* [ ] Never expose `.env`
* [ ] Configure CORS correctly
* [ ] Enable HTTPS
* [ ] Add request validation
* [ ] Add rate limiting
* [ ] Add proper error handling
* [ ] Test authentication flows
* [ ] Test protected routes
* [ ] Verify production database connection

---

## 👨‍💻 Author

**Ayush Verma**

Backend Developer & Computer Science Student

GitHub: [AyushIos2005](https://github.com/AyushIos2005)

---

## 📄 License

This project is intended for educational and development purposes.

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
