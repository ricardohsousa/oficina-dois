import { Router } from 'express';

import type { TokenService } from '../../../application/auth/services/token-service';
import type { OficinasController } from '../controllers/oficinas.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { createPermissionMiddleware } from '../middlewares/require-permission.middleware';

export const createOficinasRoutes = (
  oficinasController: OficinasController,
  tokenService: TokenService,
): Router => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);
  const requireCreateOficina = createPermissionMiddleware('oficinas', 'CREATE');
  const requireReadOficina = createPermissionMiddleware('oficinas', 'READ');
  const requireUpdateOficina = createPermissionMiddleware('oficinas', 'UPDATE');
  const requireDeleteOficina = createPermissionMiddleware('oficinas', 'DELETE');

  /**
   * @swagger
   * /oficinas:
   *   get:
   *     summary: Lista todas as oficinas
   *     tags: [Oficinas]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de oficinas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/OficinaResponseDto'
   *       401:
   *         description: Não autorizado
   */
  router.get('/oficinas', authMiddleware, requireReadOficina, oficinasController.list);

  /**
   * @swagger
   * /oficinas/{id}:
   *   get:
   *     summary: Consulta uma oficina por ID
   *     tags: [Oficinas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID da oficina
   *     responses:
   *       200:
   *         description: Oficina encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OficinaResponseDto'
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Oficina não encontrada
   */
  router.get('/oficinas/:id', authMiddleware, requireReadOficina, oficinasController.getById);

  /**
   * @swagger
   * /oficinas:
   *   post:
   *     summary: Cria uma nova oficina
   *     tags: [Oficinas]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CriarOficinaDto'
   *     responses:
   *       201:
   *         description: Oficina criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OficinaResponseDto'
   *       400:
   *         description: Erro de validação nos dados enviados
   *       401:
   *         description: Não autorizado
   *       403:
   *         description: Acesso negado (permissão insuficiente)
   */
  router.post('/oficinas', authMiddleware, requireCreateOficina, oficinasController.create);

  /**
   * @swagger
   * /oficinas/{id}:
   *   put:
   *     summary: Atualiza uma oficina por ID
   *     tags: [Oficinas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID da oficina
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CriarOficinaDto'
   *     responses:
   *       200:
   *         description: Oficina atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OficinaResponseDto'
   *       400:
   *         description: Erro de validação nos dados enviados
   *       401:
   *         description: Não autorizado
   *       403:
   *         description: Acesso negado (permissão insuficiente)
   *       404:
   *         description: Oficina não encontrada
   */
  router.put('/oficinas/:id', authMiddleware, requireUpdateOficina, oficinasController.update);

  /**
   * @swagger
   * /oficinas/{id}/inativar:
   *   patch:
   *     summary: Inativa uma oficina por ID
   *     tags: [Oficinas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID da oficina
   *     responses:
   *       200:
   *         description: Oficina inativada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OficinaResponseDto'
   *       401:
   *         description: Não autorizado
   *       403:
   *         description: Acesso negado (permissão insuficiente)
   *       404:
   *         description: Oficina não encontrada
   *       409:
   *         description: Oficina já está inativa
   */
  router.patch('/oficinas/:id/inativar', authMiddleware, requireDeleteOficina, oficinasController.inativar);

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CriarOficinaDto:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - dataInicio
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da oficina.
 *           example: "Oficina de Lógica"
 *         descricao:
 *           type: string
 *           description: Descrição da oficina.
 *           example: "Introdução a lógica de programação para crianças."
 *         dataInicio:
 *           type: string
 *           format: date
 *           description: Data de início (YYYY-MM-DD).
 *           example: "2026-05-14"
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Data de encerramento (YYYY-MM-DD), opcional.
 *           example: "2026-12-10"
 *     OficinaResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ativa, inativa]
 *         dataInicio:
 *           type: string
 *           format: date
 *         dataFim:
 *           type: string
 *           format: date
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
