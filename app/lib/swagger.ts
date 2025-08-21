import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Equity Platform API",
      version: "1.0.0",
      description: "# 🔐 Equity Platform API Documentation\n\n## **Authentication Required for Most Endpoints**\n\n**⚠️ IMPORTANT:** Most endpoints require JWT authentication. Before testing any protected endpoints:\n\n1. **Click the \"Authorize\" button (🔒)** at the top of this page\n2. **Enter your JWT token** in the `bearerAuth` field\n3. **Click \"Authorize\"** to enable protected endpoints\n4. **Click \"Close\"** to return to the documentation\n\n## **Available Endpoints**\n\n- **Commercial Properties**: Search and manage commercial properties\n- **KYC Management**: Submit and manage KYC applications\n\n## **Testing Notes**\n\n- **KYC Endpoints**: Require authentication and specific KYC status\n- **File Uploads**: Use multipart/form-data for file uploads\n- **Error Handling**: All endpoints return detailed error messages\n\n## **Need Help?**\n\nCheck the individual endpoint descriptions for detailed testing instructions and requirements.",
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
