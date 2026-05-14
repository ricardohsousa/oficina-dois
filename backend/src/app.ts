import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { JwtTokenService } from './infrastructure/auth/jwt/jwt-token-service';
import { createAtuacoesModule } from './infrastructure/atuacoes/atuacoes.module';
import { createOficinasModule } from './infrastructure/oficinas/oficinas.module';
import { createVoluntariosModule } from './infrastructure/voluntarios/voluntarios.module';
import { errorHandler } from './interfaces/http/middlewares/error-handler';
import { notFoundHandler } from './interfaces/http/middlewares/not-found-handler';
import { createAuthRoutes } from './interfaces/http/routes/auth.routes';
import { healthRoutes } from './interfaces/http/routes/health.routes';
import swaggerSpec from './swagger';

type CreateAppInput = {
  jwtSecret: string;
};

export const createApp = ({ jwtSecret }: CreateAppInput) => {
  const app = express();
  const tokenService = new JwtTokenService(jwtSecret);

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(healthRoutes);
  app.use(createAuthRoutes(jwtSecret));
  app.use(createVoluntariosModule(tokenService));
  app.use(createOficinasModule(tokenService));
  app.use(createAtuacoesModule(tokenService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
