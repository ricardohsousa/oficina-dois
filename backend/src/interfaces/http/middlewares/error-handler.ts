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
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(error);

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
      'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      'https://ellp.local/errors/internal-server-error'
    )
  );
};
