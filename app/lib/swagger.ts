import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Equity Platform API",
      version: "1.0.0",
      description: "Swagger docs for selected API endpoints",
    },
  },

  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
