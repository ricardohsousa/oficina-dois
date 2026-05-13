import { Router } from 'express';

import { AuthenticateUser } from '../../../application/auth/authenticate-user';
import { JwtTokenService } from '../../../infrastructure/auth/jwt/jwt-token-service';
import { prismaClient } from '../../../infrastructure/database/prisma/client';
import { PrismaUserAuthRepository } from '../../../infrastructure/database/prisma/repositories/prisma-user-auth-repository';
import { BcryptPasswordHashComparer } from '../../../infrastructure/crypto/bcrypt-password-hash-comparer';
import { getAuthenticatedUserController } from '../controllers/authenticated-user.controller';
import { createLoginController } from '../controllers/login.controller';
import { createAuthenticationMiddleware } from '../middlewares/authentication.middleware';

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

  authRoutes.post('/login', createLoginController(authenticateUser));
  authRoutes.get(
    '/auth/me',
    authenticationMiddleware,
    getAuthenticatedUserController
  );

  return authRoutes;
};
