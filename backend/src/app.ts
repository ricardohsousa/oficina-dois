import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

import { errorHandler } from './interfaces/http/middlewares/error-handler';
import { notFoundHandler } from './interfaces/http/middlewares/not-found-handler';
import { createAuthRoutes } from './interfaces/http/routes/auth.routes';
import { healthRoutes } from './interfaces/http/routes/health.routes';

type CreateAppInput = {
  jwtSecret: string;
};

export const createApp = ({ jwtSecret }: CreateAppInput) => {
  const app = express();

  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(healthRoutes);
  app.use(createAuthRoutes(jwtSecret));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
