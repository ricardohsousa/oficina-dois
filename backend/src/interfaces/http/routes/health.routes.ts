import { Router } from 'express';

import { healthCheck } from '../controllers/health.controller';

export const healthRoutes = Router();

healthRoutes.get('/health', healthCheck);
