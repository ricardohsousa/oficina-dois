import type { NextFunction, Request, Response } from 'express';

import { AppError, type AppErrorField } from '../../../shared/errors/app-error';

type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: AppErrorField[];
};

const createProblemDetails = (
  request: Request,
  status: number,
  title: string,
  detail: string,
  type: string,
  errors?: AppErrorField[]
): ProblemDetails => ({
  type,
  title,
  status,
  detail,
  instance: request.originalUrl,
  ...(errors ? { errors } : {})
});

export const errorHandler = (
  error: Error & { status?: number; type?: string },
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
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

  if (error instanceof AppError) {
    response.status(error.status).json(
      createProblemDetails(
        request,
        error.status,
        error.title,
        error.detail,
        error.type,
        error.errors
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
