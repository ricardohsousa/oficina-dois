import { Router } from 'express';

import type { TokenService } from '../../../application/auth/services/token-service';
import type { TermosController } from '../controllers/termos.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';

export const createTermosRoutes = (
  termosController: TermosController,
  tokenService: TokenService,
): Router => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);

  /**
   * @swagger
   * /voluntarios/{voluntarioId}/termo:
   *   post:
   *     summary: Gera um termo de voluntariado em PDF para o voluntário informado
   *     tags: [Termos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: voluntarioId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do voluntário
   *     responses:
   *       201:
   *         description: Termo gerado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TermoVoluntariadoResponseDto'
   *       400:
   *         description: Dados pendentes para geração do termo
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Voluntário não encontrado
   */
  router.post(
    '/voluntarios/:voluntarioId/termo',
    authMiddleware,
    termosController.gerar,
  );

  /**
   * @swagger
   * /termos/{termoId}/download:
   *   get:
   *     summary: Faz o download de um termo de voluntariado em PDF
   *     tags: [Termos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: termoId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do termo gerado
   *     responses:
   *       200:
   *         description: Arquivo PDF retornado com sucesso
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Termo ou arquivo não encontrado
   */
  router.get('/termos/:termoId/download', authMiddleware, termosController.download);

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     TermoVoluntariadoResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         voluntarioId:
 *           type: string
 *           format: uuid
 *         nomeArquivo:
 *           type: string
 *         mimeType:
 *           type: string
 *           example: application/pdf
 *         downloadUrl:
 *           type: string
 *           example: /termos/123/download
 *         createdAt:
 *           type: string
 *           format: date-time
 */
