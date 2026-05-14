import type { NextFunction, Request, Response } from 'express';

import type { BuscarVoluntarioPorIdUseCase } from '../../../application/voluntarios/use-cases/buscar-voluntario-por-id.use-case';
import type { CriarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/criar-voluntario.use-case';
import type { ListarVoluntariosUseCase } from '../../../application/voluntarios/use-cases/listar-voluntarios.use-case';
import {
  validateCreateVoluntario,
} from '../../validations/voluntarios-http.validator';

export class VoluntariosController {
  constructor(
    private readonly criarVoluntarioUseCase: CriarVoluntarioUseCase,
    private readonly listarVoluntariosUseCase: ListarVoluntariosUseCase,
    private readonly buscarVoluntarioPorIdUseCase: BuscarVoluntarioPorIdUseCase,
  ) {}

  list = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const voluntarios = await this.listarVoluntariosUseCase.execute();

      response.status(200).json(voluntarios);
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const voluntario = await this.buscarVoluntarioPorIdUseCase.execute(
        String(request.params.id ?? ''),
      );

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };

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
