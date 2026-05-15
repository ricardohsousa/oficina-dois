import type { NextFunction, Request, Response } from 'express';

import { createProblemDetails } from '../../../shared/http/problem-details';

export const notFoundHandler = (
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
  response.status(404).json(
    createProblemDetails(
      request,
      404,
      'Recurso não encontrado',
      'A rota informada não existe neste serviço.',
      'https://ellp.local/errors/not-found'
    )
  );
};
