import { Router } from 'express';

import { healthCheck } from '../controllers/health.controller';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Verifica a saúde da API
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Retorna o status da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: A aplicação está funcionando normalmente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

export const healthRoutes = Router();

healthRoutes.get('/health', healthCheck);
