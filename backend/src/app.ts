import express from 'express';

import { errorHandler } from './interfaces/http/middlewares/error-handler';
import { notFoundHandler } from './interfaces/http/middlewares/not-found-handler';
import { healthRoutes } from './interfaces/http/routes/health.routes';

export const app = express();

app.use(healthRoutes);
app.use(express.json());
app.use(notFoundHandler);
app.use(errorHandler);
