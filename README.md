# LinkedIn Backend API

A RESTful API backend for a LinkedIn clone built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **User Management**: User registration, login, and profile management
- **Posts**: Create, read, update, and delete posts
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript support
- **CORS**: Configurable cross-origin resource sharing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd linkedin-backend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit the \`.env\` file with your configuration:

\`\`\`env
NODE_ENV=development
PORT=3000

CORS_ORIGIN=*

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=linkedin_db

JWT_ACCESS_SECRET=your-secret-access-key
JWT_REFRESH_SECRET=your-secret-refresh-key
\`\`\`

### 4. Set Up the Database

Create a PostgreSQL database:

\`\`\`bash
createdb linkedin_db
\`\`\`

Or using PostgreSQL CLI:

\`\`\`sql
CREATE DATABASE linkedin_db;
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

The server will start on \`http://localhost:3000\`

### 6. Access API Documentation

Visit \`http://localhost:3000/api-docs\` to view the interactive Swagger documentation.

## Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build TypeScript to JavaScript
- \`npm start\` - Start production server (requires build first)
- \`npm run seed\` - Seed the database with sample data
- \`npm run typeorm\` - Run TypeORM CLI commands

## API Endpoints

### Authentication

- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/refresh\` - Refresh access token

### Posts

- \`GET /api/posts\` - Get all posts (requires authentication)
- \`GET /api/posts/:id\` - Get a single post (requires authentication)
- \`POST /api/posts\` - Create a new post (requires authentication)
- \`PUT /api/posts/:id\` - Update a post (requires authentication)
- \`DELETE /api/posts/:id\` - Delete a post (requires authentication)

### Health Check

- \`GET /health\` - Health check endpoint

## Project Structure

\`\`\`
linkedin-backend/
├── src/
│   ├── config/          # Configuration files (Swagger, etc.)
│   ├── controllers/     # Request handlers
│   ├── entities/        # TypeORM entities
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts (seed, etc.)
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── data-source.ts   # TypeORM configuration
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── node_modules/        # Dependencies
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── render.yaml          # Render deployment configuration
├── DEPLOYMENT.md        # Deployment guide
└── README.md            # This file
\`\`\`

## Database Schema

### User Entity

- \`id\` (UUID) - Primary key
- \`email\` (string) - Unique email address
- \`password\` (string) - Hashed password
- \`name\` (string) - User's full name
- \`headline\` (string, optional) - Professional headline
- \`profilePicture\` (string, optional) - Profile picture URL
- \`createdAt\` (timestamp) - Account creation date
- \`updatedAt\` (timestamp) - Last update date

### Post Entity

- \`id\` (UUID) - Primary key
- \`content\` (text) - Post content
- \`author\` (User) - Post author (relation)
- \`createdAt\` (timestamp) - Post creation date
- \`updatedAt\` (timestamp) - Last update date

## Authentication

This API uses JWT (JSON Web Tokens) for authentication:

1. **Register** a new user via \`/api/auth/register\`
2. **Login** with credentials via \`/api/auth/login\` to receive:
   - \`accessToken\` - Short-lived token for API requests
   - \`refreshToken\` - Long-lived token to get new access tokens
3. Include the \`accessToken\` in the \`Authorization\` header for protected routes:
   \`\`\`
   Authorization: Bearer <your-access-token>
   \`\`\`
4. When the access token expires, use the refresh token to get a new one via \`/api/auth/refresh\`

## CORS Configuration

CORS is configured via the \`CORS_ORIGIN\` environment variable:

- **Development**: Set to \`*\` to allow all origins
- **Production**: Set to your frontend domain (e.g., \`https://your-frontend.com\`)

Multiple origins can be configured by modifying the CORS configuration in \`src/index.ts\`.

## Deployment

This application is ready to deploy to Render. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will automatically detect \`render.yaml\` and deploy

The \`render.yaml\` file includes:
- PostgreSQL database configuration
- Web service configuration
- Environment variables setup
- Auto-generated JWT secrets

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| \`NODE_ENV\` | Environment mode | No | \`development\` |
| \`PORT\` | Server port | No | \`3000\` |
| \`CORS_ORIGIN\` | Allowed CORS origins | No | \`*\` |
| \`DB_HOST\` | PostgreSQL host | Yes | \`localhost\` |
| \`DB_PORT\` | PostgreSQL port | No | \`5432\` |
| \`DB_USERNAME\` | Database username | Yes | \`postgres\` |
| \`DB_PASSWORD\` | Database password | Yes | - |
| \`DB_NAME\` | Database name | Yes | \`linkedin_db\` |
| \`JWT_ACCESS_SECRET\` | JWT access token secret | Yes | - |
| \`JWT_REFRESH_SECRET\` | JWT refresh token secret | Yes | - |

## Development

### Adding New Features

1. Create entity in \`src/entities/\`
2. Create service in \`src/services/\`
3. Create controller in \`src/controllers/\`
4. Create routes in \`src/routes/\`
5. Register routes in \`src/index.ts\`

### Database Migrations

TypeORM is configured to auto-sync in development mode. For production, use migrations:

\`\`\`bash
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
\`\`\`

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Environment variables for sensitive data
- CORS protection
- SQL injection prevention via TypeORM parameterized queries

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in \`.env\`
- Verify database exists

### Port Already in Use

Change the \`PORT\` in \`.env\` file or kill the process using the port:

\`\`\`bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
\`\`\`

### TypeScript Build Errors

Clean and rebuild:

\`\`\`bash
rm -rf dist
npm run build
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

ISC

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For general questions, check the API documentation at \`/api-docs\`
