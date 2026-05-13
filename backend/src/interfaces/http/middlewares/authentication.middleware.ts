import type { NextFunction, Request, Response } from 'express';

import type { AuthTokenPayload, TokenService } from '../../../application/auth/services/token-service';
import { HttpError } from '../../../shared/errors/http-error';

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};

export const createAuthenticationMiddleware =
  (tokenService: TokenService) =>
  (
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction
  ): void => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      next(
        new HttpError({
          status: 401,
          title: 'Falha na autenticação',
          detail: 'O header Authorization é obrigatório para acessar este recurso.',
          type: 'https://ellp.local/errors/authentication-required'
        })
      );
      return;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      next(
        new HttpError({
          status: 401,
          title: 'Falha na autenticação',
          detail: 'O header Authorization deve usar o formato Bearer token.',
          type: 'https://ellp.local/errors/invalid-authorization-header'
        })
      );
      return;
    }

    request.auth = tokenService.verify(token);
    next();
  };
