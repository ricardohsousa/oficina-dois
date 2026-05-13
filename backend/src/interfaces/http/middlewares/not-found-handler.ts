import type { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  request: Request,
  response: Response,
  _next: NextFunction
): void => {
  response.status(404).json({
    type: 'https://ellp.local/errors/not-found',
    title: 'Recurso não encontrado',
    status: 404,
    detail: 'A rota informada não existe neste serviço.',
    instance: request.originalUrl
  });
};
