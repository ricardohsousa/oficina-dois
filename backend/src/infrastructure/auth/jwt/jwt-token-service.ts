import jwt from 'jsonwebtoken';

import { HttpError } from '../../../shared/errors/http-error';
import type {
  AuthTokenPayload,
  TokenService
} from '../../../application/auth/services/token-service';

const JWT_EXPIRATION_TIME = '1d';

export class JwtTokenService implements TokenService {
  private readonly secret: string;

  constructor(secret: string | undefined) {
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required.');
    }

    this.secret = secret;
  }

  sign(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: JWT_EXPIRATION_TIME
    });
  }

  verify(token: string): AuthTokenPayload {
    try {
      const decodedToken = jwt.verify(token, this.secret);

      if (
        typeof decodedToken === 'string' ||
        typeof decodedToken.sub !== 'string' ||
        typeof decodedToken.email !== 'string' ||
        typeof decodedToken.nome !== 'string' ||
        !decodedToken.sub ||
        !decodedToken.email
      ) {
        throw new Error('Invalid token payload.');
      }

      return {
        sub: decodedToken.sub,
        email: decodedToken.email,
        nome: decodedToken.nome
      };
    } catch {
      throw new HttpError({
        status: 401,
        title: 'Falha na autenticação',
        detail: 'O token informado é inválido ou expirou.',
        type: 'https://ellp.local/errors/invalid-token'
      });
    }
  }
}
