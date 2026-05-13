import type { Response } from 'express';

import type { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export const getAuthenticatedUserController = (
  request: AuthenticatedRequest,
  response: Response
): void => {
  response.status(200).json({
    user: {
      id: Number(request.auth?.sub),
      nome: request.auth?.nome,
      email: request.auth?.email
    }
  });
};
