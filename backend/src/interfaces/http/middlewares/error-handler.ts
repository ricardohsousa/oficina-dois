import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../../../shared/errors/http-error';
import { createProblemDetails } from '../../../shared/http/problem-details';

export const errorHandler = (
  error: Error & { type?: string },
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
  if (error instanceof HttpError) {
    response.status(error.status).json(
      createProblemDetails(
        request,
        error.status,
        error.title,
        error.detail,
        error.type
      )
    );
    return;
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json(
      createProblemDetails(
        request,
        400,
        'Erro de validação',
        'O corpo da requisição contém JSON inválido.',
        'https://ellp.local/errors/validation-error'
      )
    );
    return;
  }

  response.status(500).json(
    createProblemDetails(
      request,
      500,
      'Erro interno',
      'Ocorreu um erro inesperado ao processar a requisição.',
      'https://ellp.local/errors/internal-server-error'
    )
  );
};
