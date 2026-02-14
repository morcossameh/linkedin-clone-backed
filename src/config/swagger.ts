import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkedIn Clone API",
      version: "1.0.0",
      description: "REST API for LinkedIn clone backend with authentication",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            profilePicture: {
              type: "string",
              nullable: true,
              description: "URL to profile picture",
            },
            headline: {
              type: "string",
              nullable: true,
              description: "User headline",
            },
            bio: {
              type: "string",
              nullable: true,
              description: "User biography",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
              minLength: 6,
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            accessToken: {
              type: "string",
              description: "JWT access token (expires in 15 minutes)",
            },
            refreshToken: {
              type: "string",
              description: "JWT refresh token (expires in 7 days)",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              description: "The refresh token",
            },
          },
        },
        RefreshTokenResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "New JWT access token",
            },
            refreshToken: {
              type: "string",
              description: "New JWT refresh token",
            },
          },
        },
        Reaction: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Reaction type (e.g., thumbs-up, heart, lightbulb)",
              example: "thumbs-up",
            },
            count: {
              type: "integer",
              description: "Number of this reaction type",
              example: 10,
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Post unique identifier",
            },
            content: {
              type: "string",
              description: "Post content (can include HTML)",
            },
            reactions: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Reaction",
              },
              description: "Array of reactions on the post",
            },
            commentsCount: {
              type: "integer",
              description: "Number of comments on the post",
              default: 0,
            },
            repostsCount: {
              type: "integer",
              description: "Number of reposts",
              default: 0,
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who created the post",
            },
            user: {
              $ref: "#/components/schemas/User",
              description: "User who created the post",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Post creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: {
              type: "string",
              description: "Post content (can include HTML)",
              example: "<p>This is my first post!</p>",
            },
            reactions: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Reaction",
              },
              description: "Initial reactions (optional)",
            },
            commentsCount: {
              type: "integer",
              description: "Initial comment count (optional)",
              default: 0,
            },
            repostsCount: {
              type: "integer",
              description: "Initial repost count (optional)",
              default: 0,
            },
          },
        },
        UpdatePostRequest: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Updated post content",
            },
            reactions: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Reaction",
              },
              description: "Updated reactions",
            },
            commentsCount: {
              type: "integer",
              description: "Updated comment count",
            },
            repostsCount: {
              type: "integer",
              description: "Updated repost count",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Posts",
        description: "Post management endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
