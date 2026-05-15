import type { Request } from 'express';

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
};

export const createProblemDetails = (
  request: Request,
  status: number,
  title: string,
  detail: string,
  type: string
): ProblemDetails => ({
  type,
  title,
  status,
  detail,
  instance: request.originalUrl
});
