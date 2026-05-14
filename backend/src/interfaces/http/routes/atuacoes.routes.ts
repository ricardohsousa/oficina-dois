import { Router } from 'express';

import type { TokenService } from '../../../application/auth/services/token-service';
import type { AtuacoesController } from '../controllers/atuacoes.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';

export const createAtuacoesRoutes = (
  atuacoesController: AtuacoesController,
  tokenService: TokenService,
): Router => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);

  /**
   * @swagger
   * /voluntarios/{voluntarioId}/oficinas:
   *   post:
   *     summary: Associa um voluntário a uma oficina
   *     tags: [Atuações]
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AssociarVoluntarioOficinaDto'
   *     responses:
   *       201:
   *         description: Associação criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AtuacaoResponseDto'
   *       400:
   *         description: Erro de validação nos dados enviados
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Voluntário ou oficina não encontrado
   *       409:
   *         description: Voluntário já associado à oficina, voluntário inativo ou oficina inativa
   */
  router.post(
    '/voluntarios/:voluntarioId/oficinas',
    authMiddleware,
    atuacoesController.associar,
  );

  /**
   * @swagger
   * /voluntarios/{voluntarioId}/oficinas:
   *   get:
   *     summary: Lista as oficinas associadas a um voluntário
   *     tags: [Atuações]
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
   *       200:
   *         description: Lista de atuações retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/AtuacaoResponseDto'
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Voluntário não encontrado
   */
  router.get(
    '/voluntarios/:voluntarioId/oficinas',
    authMiddleware,
    atuacoesController.listarPorVoluntario,
  );

  /**
   * @swagger
   * /voluntarios/{voluntarioId}/historico:
   *   get:
   *     summary: Lista o histórico completo de atuação de um voluntário
   *     tags: [Atuações]
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
   *       200:
   *         description: Histórico de atuação retornado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/HistoricoAtuacaoResponseDto'
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Voluntário não encontrado
   */
  router.get(
    '/voluntarios/:voluntarioId/historico',
    authMiddleware,
    atuacoesController.listarHistorico,
  );

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     AssociarVoluntarioOficinaDto:
 *       type: object
 *       required:
 *         - oficinaId
 *         - dataInicio
 *       properties:
 *         oficinaId:
 *           type: string
 *           format: uuid
 *           description: ID da oficina ativa a ser associada.
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         dataInicio:
 *           type: string
 *           format: date
 *           description: Data de início da participação (YYYY-MM-DD).
 *           example: "2026-05-14"
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Data de encerramento da participação (YYYY-MM-DD), opcional.
 *           example: "2026-12-10"
 *         cargaHoraria:
 *           type: integer
 *           nullable: true
 *           description: Carga horária dedicada à oficina, opcional.
 *           example: 40
 *     AtuacaoResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         voluntarioId:
 *           type: string
 *           format: uuid
 *         oficinaId:
 *           type: string
 *           format: uuid
 *         dataInicio:
 *           type: string
 *           format: date
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *         cargaHoraria:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     HistoricoAtuacaoResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         voluntarioId:
 *           type: string
 *           format: uuid
 *         oficinaId:
 *           type: string
 *           format: uuid
 *         dataInicio:
 *           type: string
 *           format: date
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *         cargaHoraria:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         oficina:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             nome:
 *               type: string
 *             descricao:
 *               type: string
 *             status:
 *               type: string
 *               enum: [ativa, inativa]
 *             dataInicio:
 *               type: string
 *               format: date
 *             dataFim:
 *               type: string
 *               format: date
 *               nullable: true
 */
