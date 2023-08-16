import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { version } from '../../package.json';

const initializeSwagger = (app: Express) => {
  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'REST API',
        version,
        description: 'Example docs',
      },
    },
    apis: ['src/swagger/*.yaml'],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default initializeSwagger;
