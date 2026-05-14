import { Router } from 'express';
import { TokenService } from '../../../application/auth/services/token-service';

import { VoluntariosController } from '../controllers/voluntarios.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';

export const createVoluntariosRoutes = (
  voluntariosController: VoluntariosController,
  tokenService: TokenService,
): Router => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);

  /**
   * @swagger
   * /voluntarios:
   *   get:
   *     summary: Lista os voluntários cadastrados
   *     tags: [Voluntários]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de voluntários retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/VoluntarioResponseDto'
   *       401:
   *         description: Não autorizado
   */
  router.get('/voluntarios', authMiddleware, voluntariosController.list);

  /**
   * @swagger
   * /voluntarios:
   *   post:
   *     summary: Cria um novo voluntário
   *     tags: [Voluntários]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CriarVoluntarioDto'
   *     responses:
   *       201:
   *         description: Voluntário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VoluntarioResponseDto'
   *       400:
   *         description: Erro de validação nos dados enviados
   *       401:
   *         description: Não autorizado
   *       409:
   *         description: Conflito de dados (CPF ou E-mail já cadastrado)
   */
  router.post('/voluntarios', authMiddleware, voluntariosController.create);

  /**
   * @swagger
   * /voluntarios/{id}:
   *   get:
   *     summary: Consulta um voluntário por ID
   *     tags: [Voluntários]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do voluntário
   *     responses:
   *       200:
   *         description: Voluntário encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VoluntarioResponseDto'
   *       401:
   *         description: Não autorizado
   *       404:
   *         description: Voluntário não encontrado
   */
  router.get('/voluntarios/:id', authMiddleware, voluntariosController.getById);

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CriarVoluntarioDto:
 *       type: object
 *       required:
 *         - nomeCompleto
 *         - cpf
 *         - dataNascimento
 *         - email
 *         - telefone
 *         - endereco
 *         - dataEntrada
 *       properties:
 *         nomeCompleto:
 *           type: string
 *           description: Nome completo do voluntário.
 *           example: "João da Silva"
 *         cpf:
 *           type: string
 *           description: CPF do voluntário (com ou sem formatação).
 *           example: "12345678900"
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento (YYYY-MM-DD).
 *           example: "1990-01-15"
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do voluntário.
 *           example: "joao.silva@example.com"
 *         telefone:
 *           type: string
 *           description: Telefone de contato.
 *           example: "41999998888"
 *         endereco:
 *           type: string
 *           description: Endereço completo.
 *           example: "Rua das Flores, 123, Curitiba - PR"
 *         dataEntrada:
 *           type: string
 *           format: date
 *           description: Data de entrada no projeto (YYYY-MM-DD).
 *           example: "2026-05-13"
 *     VoluntarioResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do voluntário.
 *         nomeCompleto:
 *           type: string
 *         cpf:
 *           type: string
 *         dataNascimento:
 *           type: string
 *           format: date
 *         email:
 *           type: string
 *           format: email
 *         telefone:
 *           type: string
 *         endereco:
 *           type: string
 *         dataEntrada:
 *           type: string
 *           format: date
 *         dataSaida:
 *           type: string
 *           format: date
 *           nullable: true
 *         ativo:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
