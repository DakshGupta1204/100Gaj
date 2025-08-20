import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Equity Platform API",
      version: "1.0.0",
      description: "Swagger docs for selected API endpoints",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Commercial",
        description: "Commercial property management endpoints",
      },
      {
        name: "Commercial Properties",
        description: "Commercial property search and retrieval endpoints",
      },
      {
        name: "KYC",
        description: "Know Your Customer verification and management endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
