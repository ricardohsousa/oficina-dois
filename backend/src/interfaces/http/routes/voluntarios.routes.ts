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
