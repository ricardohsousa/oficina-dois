import { Router } from 'express';
import { TokenService } from '../../../application/auth/services/token-service';

import { VoluntariosController } from '../controllers/voluntarios.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { createPermissionMiddleware } from '../middlewares/require-permission.middleware';

export const createVoluntariosRoutes = (
  voluntariosController: VoluntariosController,
  tokenService: TokenService,
): Router => {
  const router = Router();
  const authMiddleware = createAuthenticationMiddleware(tokenService);
  const requireCreateVoluntario = createPermissionMiddleware('voluntarios', 'CREATE');
  const requireReadVoluntario = createPermissionMiddleware('voluntarios', 'READ');
  const requireUpdateVoluntario = createPermissionMiddleware('voluntarios', 'UPDATE');
  const requireDeleteVoluntario = createPermissionMiddleware('voluntarios', 'DELETE');

  /**
   * @swagger
   * /voluntarios:
   *   get:
   *     summary: Lista e filtra voluntários cadastrados
   *     tags: [Voluntários]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: nome
   *         schema:
   *           type: string
   *         description: Filtra por nome (busca parcial, sem distinção de maiúsculas/minúsculas)
   *         example: "João"
   *       - in: query
   *         name: cpf
   *         schema:
   *           type: string
   *         description: Filtra por CPF (com ou sem formatação, busca exata)
   *         example: "12345678900"
   *       - in: query
   *         name: email
   *         schema:
   *           type: string
   *         description: Filtra por e-mail (busca parcial, sem distinção de maiúsculas/minúsculas)
   *         example: "joao@"
   *       - in: query
   *         name: ativo
   *         schema:
   *           type: boolean
   *         description: Filtra por status ativo/inativo
   *         example: true
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
  router.get('/voluntarios', authMiddleware, requireReadVoluntario, voluntariosController.list);

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
   *       403:
   *         description: Acesso negado (permissão insuficiente)
   *       409:
   *         description: Conflito de dados (CPF ou E-mail já cadastrado)
   */
  router.post('/voluntarios', authMiddleware, requireCreateVoluntario, voluntariosController.create);

  /**
   * @swagger
   * /voluntarios/{id}:
   *   put:
   *     summary: Atualiza um voluntário por ID
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CriarVoluntarioDto'
   *     responses:
   *       200:
   *         description: Voluntário atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VoluntarioResponseDto'
   *       400:
   *         description: Erro de validação nos dados enviados
   *       401:
   *         description: Não autorizado
   *       403:
   *         description: Acesso negado (permissão insuficiente)
   *       404:
   *         description: Voluntário não encontrado
   *       409:
   *         description: Conflito de dados (CPF ou E-mail já cadastrado)
   */
  router.put('/voluntarios/:id', authMiddleware, requireUpdateVoluntario, voluntariosController.update);

  /**
   * @swagger
 * /voluntarios/{id}/inativar:
 *   patch:
 *     summary: Inativa um voluntário por ID e registra a data de saída automaticamente
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
 *         description: Voluntário inativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoluntarioResponseDto'
 *       400:
 *         description: Erro de validação nos dados enviados
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (permissão insuficiente)
 *       404:
 *         description: Voluntário não encontrado
 *       409:
 *         description: Voluntário já está inativo
   */
  router.patch('/voluntarios/:id/inativar', authMiddleware, requireDeleteVoluntario, voluntariosController.inativar);

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
  router.get('/voluntarios/:id', authMiddleware, requireReadVoluntario, voluntariosController.getById);

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
