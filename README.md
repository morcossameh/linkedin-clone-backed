# LinkedIn Backend

A REST API backend for a LinkedIn clone built with Express, TypeScript, TypeORM, and PostgreSQL.

## Features

- User authentication with JWT (access & refresh tokens)
- User registration and login
- Protected routes with authentication middleware
- PostgreSQL database with TypeORM
- TypeScript for type safety
- Swagger API documentation

## Tech Stack

- Node.js & Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
createdb linkedin_db
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the database credentials and JWT secrets.

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Documentation

Interactive API documentation is available via Swagger UI:
- **Swagger UI**: http://localhost:3000/api-docs

The Swagger interface allows you to:
- View all available endpoints
- Test API requests directly from the browser
- See request/response schemas
- Authenticate with JWT tokens

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token"
}
```

#### POST /api/auth/login
Login with existing credentials.

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: Same as register

#### POST /api/auth/refresh-token
Get a new access token using refresh token.

Request body:
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response:
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-jwt-refresh-token"
}
```

#### GET /api/auth/me
Get current user details (requires authentication).

Headers:
```
Authorization: Bearer <access-token>
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": null,
  "headline": null,
  "bio": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server

## Project Structure

```
src/
├── controllers/      # Request handlers
├── entities/        # TypeORM entities
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── data-source.ts   # TypeORM configuration
└── index.ts         # Application entry point
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
