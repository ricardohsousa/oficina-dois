import type { Request, Response } from 'express';

import type { AuthenticateUser } from '../../../application/auth/authenticate-user';

export const createLoginController =
  (authenticateUser: AuthenticateUser) =>
  async (request: Request, response: Response): Promise<void> => {
    const result = await authenticateUser.execute({
      email: String(request.body?.email ?? ''),
      senha: String(request.body?.senha ?? '')
    });

    response.status(200).json(result);
  };
