const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Naka Project API',
      version: '1.0.0',
      description: 'API documentation for Naka Project',
    },
    servers: [
      {
        url: 'http://localhost:8080/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./app/routes/*.js', './app/routes/**/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
