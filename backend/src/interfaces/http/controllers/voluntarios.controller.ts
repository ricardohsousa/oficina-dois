import type { NextFunction, Request, Response } from 'express';

import type { CriarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/criar-voluntario.use-case';
import {
  validateCreateVoluntario,
} from '../../validations/voluntarios-http.validator';

export class VoluntariosController {
  constructor(
    private readonly criarVoluntarioUseCase: CriarVoluntarioUseCase,
  ) {}

  create = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validateCreateVoluntario(request.body);
      const voluntario = await this.criarVoluntarioUseCase.execute(input);

      response.status(201).json(voluntario);
    } catch (error) {
      next(error);
    }
  };
}
