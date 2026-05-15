import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Controle de Voluntários - ELLP API',
      version: '1.0.0',
      description:
        'API para o sistema de gerenciamento de voluntários do projeto de extensão ELLP.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/interfaces/http/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

