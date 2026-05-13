import express from 'express';

import { createVoluntariosModule } from './infrastructure/voluntarios/voluntarios.module';
import { errorHandler } from './interfaces/http/middlewares/error-handler';
import { notFoundHandler } from './interfaces/http/middlewares/not-found-handler';
import { healthRoutes } from './interfaces/http/routes/health.routes';

export const app = express();

app.use(express.json());
app.use(healthRoutes);
app.use(createVoluntariosModule());
app.use(notFoundHandler);
app.use(errorHandler);
