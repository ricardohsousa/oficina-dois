import { Router } from 'express';

import { AuthenticateUser } from '../../../application/auth/authenticate-user';
import { JwtTokenService } from '../../../infrastructure/auth/jwt/jwt-token-service';
import { prismaClient } from '../../../infrastructure/database/prisma/client';
import { PrismaUserAuthRepository } from '../../../infrastructure/database/prisma/repositories/prisma-user-auth-repository';
import { BcryptPasswordHashComparer } from '../../../infrastructure/crypto/bcrypt-password-hash-comparer';
import { getAuthenticatedUserController } from '../controllers/authenticated-user.controller';
import { createLoginController } from '../controllers/login.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: 'admin@ellp.com'
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: 'senha123'
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Token de acesso JWT
 *         tokenType:
 *           type: string
 *           example: 'Bearer'
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *
 *     AuthenticatedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export const createAuthRoutes = (jwtSecret: string): Router => {
  const authRoutes = Router();
  const userAuthRepository = new PrismaUserAuthRepository(prismaClient);
  const passwordHashComparer = new BcryptPasswordHashComparer();
  const tokenService = new JwtTokenService(jwtSecret);
  const authenticateUser = new AuthenticateUser(
    userAuthRepository,
    passwordHashComparer,
    tokenService
  );
  const authenticationMiddleware = createAuthenticationMiddleware(tokenService);

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Autentica um usuário e retorna um token de acesso
   *     tags: [Autenticação]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Autenticação bem-sucedida
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Dados de entrada inválidos
   *       401:
   *         description: Credenciais inválidas
   */
  authRoutes.post('/login', createLoginController(authenticateUser));

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Retorna os dados do usuário autenticado
   *     tags: [Autenticação]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados do usuário
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthenticatedUser'
   *       401:
   *         description: Token não fornecido ou inválido
   */
  authRoutes.get(
    '/auth/me',
    authenticationMiddleware,
    getAuthenticatedUserController
  );

  return authRoutes;
};
