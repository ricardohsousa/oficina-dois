import { Router } from 'express';

import type { TokenService } from '../../../application/auth/services/token-service';
import type { AuditoriaController } from '../controllers/auditoria.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { createPermissionMiddleware } from '../middlewares/require-permission.middleware';

export const createAuditoriaRoutes = (
  auditoriaController: AuditoriaController,
  tokenService: TokenService,
) => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);
  const requireReadAuditoria = createPermissionMiddleware('auditoria', 'READ');

  /**
   * /auditorias:
   *   get:
   *     summary: Lista registros de auditoria
   *     tags: [Auditoria]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: acao
   *         schema:
   *           type: string
   *       - in: query
   *         name: entidade
   *         schema:
   *           type: string
   *       - in: query
   *         name: entidadeId
   *         schema:
   *           type: string
   *       - in: query
   *         name: usuarioId
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lista de registros de auditoria
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RegistroAuditoriaResponseDto'
   */
  router.get('/auditorias', authMiddleware, requireReadAuditoria, auditoriaController.list);

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroAuditoriaResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         usuarioId:
 *           type: integer
 *           nullable: true
 *         usuarioNome:
 *           type: string
 *           nullable: true
 *         usuarioEmail:
 *           type: string
 *           nullable: true
 *         acao:
 *           type: string
 *         entidade:
 *           type: string
 *         entidadeId:
 *           type: string
 *         descricao:
 *           type: string
 *         dadosAnteriores:
 *           nullable: true
 *         dadosNovos:
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */
