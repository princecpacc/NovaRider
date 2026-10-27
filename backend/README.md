# NovaRide Backend

Backend API for the NovaRide ride-booking platform.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator

## Run Locally

```bash
npm install
npm run dev
```

## Base URL

```text
http://localhost:4000
```

---

# User APIs

## Register User

```http
POST /users/register
```

Request:

```json
{
  "name": "Harshit",
  "email": "harshit@example.com",
  "password": "123456",
  "phone": "9876543210"
}
```

## Login User

```http
POST /users/login
```

Request:

```json
{
  "email": "harshit@example.com",
  "password": "123456"
}
```

## Get User Profile

```http
GET /users/profile
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

## Logout User

```http
POST /users/logout
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Captain APIs

## Register Captain

```http
POST /captains/register
```

Request:

```json
{
  "name": "Hoon",
  "email": "hoon@captain.com",
  "password": "Captain!123",
  "phone": "7877304998",
  "vehicle": {
    "color": "red",
    "licensePlate": "RJ06_3110",
    "capacity": 3,
    "vehicleType": "car"
  },
  "location": "Bhilwara 311001"
}
```

## Login Captain

```http
POST /captains/login
```

Request:

```json
{
  "email": "hoon@captain.com",
  "password": "Captain!123"
}
```

## Get Captain Profile

```http
GET /captains/profile
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

## Logout Captain

```http
POST /captains/logout
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Common Error Responses

## Unauthorized

```json
{
  "success": false,
  "message": "Authorization denied"
}
```

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```
