# 🚖 NovaRide Backend + Frontend (Authentication Module)

NovaRide is a full-stack MERN ride-booking application inspired by Uber.  
This repository currently contains the complete authentication system for both **Passengers** and **Captains**.

> ⚠️ Project Status: In Development

---

# Tech Stack

## Frontend
- React
- React Router DOM
- Tailwind CSS
- Fetch API

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator

---

# Features Completed

## Passenger

- User Registration
- User Login
- User Profile
- User Logout
- JWT Authentication
- Protected Routes
- Token Blacklisting

---

## Captain

- Captain Registration
- Captain Login
- Captain Profile
- Captain Logout
- Vehicle Registration
- JWT Authentication
- Token Blacklisting

---

# Authentication Flow

```text
Signup/Login
      │
      ▼
 Backend validates data
      │
      ▼
 Password hashed using bcrypt
      │
      ▼
 JWT Token generated
      │
      ▼
 Token stored in browser
      │
      ▼
 Protected routes accessible
```

---

# Project Structure

```text
backend/
│
├── src
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── config
│   └── app.js
│
└── server.js


frontend/
│
├── src
│   ├── pages
│   ├── components
│   ├── services
│   ├── assets
│   └── App.jsx
```

---

# API Endpoints

## Passenger

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/users/signup` | Register a passenger |
| POST | `/users/login` | Login passenger |
| GET | `/users/profile` | Get passenger profile |
| POST | `/users/logout` | Logout passenger |




---

## Captain

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/captains/register` | Register captain |
| POST | `/captains/login` | Login captain |
| GET | `/captains/profile` | Get captain profile |
| POST | `/captains/logout` | Logout captain |

---

# API Documentation

Base URL:

```text
http://localhost:4000
```

Protected routes require:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Passenger APIs

## Register Passenger

```http
POST /users/signup
```

### Request

```json
{
  "name": "Harshit Lakhara",
  "email": "harshit@example.com",
  "password": "123456",
  "phone": "9876543210"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "_id": "USER_ID",
    "name": "Harshit Lakhara",
    "email": "harshit@example.com",
    "phone": "9876543210"
  }
}
```

### Possible Errors

```json
{
  "success": false,
  "message": "Validation failed"
}
```

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## Login Passenger

```http
POST /users/login
```

### Request

```json
{
  "email": "harshit@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "_id": "USER_ID",
    "name": "Harshit Lakhara",
    "email": "harshit@example.com",
    "phone": "9876543210"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Get Passenger Profile

```http
GET /users/profile
```

### Request Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "user": {
    "_id": "USER_ID",
    "name": "Harshit Lakhara",
    "email": "harshit@example.com",
    "phone": "9876543210"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

---

## Logout Passenger

```http
POST /users/logout
```

### Request Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

After logout, the same token is added to the blacklist and cannot be used again.

### Error Response

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

---

# Captain APIs

## Register Captain

```http
POST /captains/register
```

### Request

```json
{
  "name": "Hoon",
  "email": "hoon@captain.com",
  "password": "Captain!123",
  "phone": "7877304998",
  "vehicle": {
    "color": "Red",
    "licensePlate": "RJ06AB3110",
    "capacity": 3,
    "vehicleType": "car"
  },
  "location": "Bhilwara 311001"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Captain registered successfully",
  "token": "JWT_TOKEN",
  "captain": {
    "_id": "CAPTAIN_ID",
    "name": "Hoon",
    "email": "hoon@captain.com",
    "phone": "7877304998",
    "vehicle": {
      "color": "Red",
      "licensePlate": "RJ06AB3110",
      "capacity": 3,
      "vehicleType": "car"
    },
    "location": "Bhilwara 311001"
  }
}
```

### Possible Errors

```json
{
  "success": false,
  "message": "Validation failed"
}
```

```json
{
  "success": false,
  "message": "Captain already exists"
}
```

---

## Login Captain

```http
POST /captains/login
```

### Request

```json
{
  "email": "hoon@captain.com",
  "password": "Captain!123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "captain": {
    "_id": "CAPTAIN_ID",
    "name": "Hoon",
    "email": "hoon@captain.com",
    "phone": "7877304998"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Get Captain Profile

```http
GET /captains/profile
```

### Request Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "captain": {
    "_id": "CAPTAIN_ID",
    "name": "Hoon",
    "email": "hoon@captain.com",
    "phone": "7877304998",
    "vehicle": {
      "color": "Red",
      "licensePlate": "RJ06AB3110",
      "capacity": 3,
      "vehicleType": "car"
    },
    "location": "Bhilwara 311001"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

---

## Logout Captain

```http
POST /captains/logout
```

### Request Header

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

After logout, the same token cannot access protected captain routes.

### Error Response

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

---

# Common Status Codes

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created successfully |
| `400` | Invalid request data |
| `401` | Missing, invalid, expired, or blacklisted token |
| `409` | Account already exists |
| `500` | Internal server error |

---

# Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected routes require a valid Bearer Token.
- Logged-out tokens are blacklisted.
- Request validation using express-validator.

---

# Current Frontend

- Home Page
- Shared Login Page (Passenger / Captain)
- Passenger Signup
- Captain Signup
- Passenger Profile
- Captain Profile

---

# Upcoming Features

- Ride Booking
- Fare Estimation
- Google Maps Integration
- Captain Ride Requests
- Live Ride Tracking
- Socket.IO
- Payments
- Ride History
- Ratings & Reviews
- Admin Dashboard

---

# Author

**Harshit Lakhara**

Building NovaRide to learn industry-standard MERN development from scratch.