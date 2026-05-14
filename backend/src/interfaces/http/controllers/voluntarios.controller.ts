import type { NextFunction, Request, Response } from 'express';

import type { AtualizarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/atualizar-voluntario.use-case';
import type { BuscarVoluntarioPorIdUseCase } from '../../../application/voluntarios/use-cases/buscar-voluntario-por-id.use-case';
import type { CriarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/criar-voluntario.use-case';
import type { InativarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/inativar-voluntario.use-case';
import type { ListarVoluntariosUseCase } from '../../../application/voluntarios/use-cases/listar-voluntarios.use-case';
import {
  parseVoluntarioFilters,
  validateCreateVoluntario,
} from '../../validations/voluntarios-http.validator';

export class VoluntariosController {
  constructor(
    private readonly criarVoluntarioUseCase: CriarVoluntarioUseCase,
    private readonly atualizarVoluntarioUseCase: AtualizarVoluntarioUseCase,
    private readonly inativarVoluntarioUseCase: InativarVoluntarioUseCase,
    private readonly listarVoluntariosUseCase: ListarVoluntariosUseCase,
    private readonly buscarVoluntarioPorIdUseCase: BuscarVoluntarioPorIdUseCase,
  ) {}

  list = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = parseVoluntarioFilters(request.query as Record<string, unknown>);
      const voluntarios = await this.listarVoluntariosUseCase.execute(filters);

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

  update = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validateCreateVoluntario(request.body);
      const voluntario = await this.atualizarVoluntarioUseCase.execute(
        String(request.params.id ?? ''),
        input,
      );

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };

  inativar = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const voluntario = await this.inativarVoluntarioUseCase.execute(String(request.params.id ?? ''));

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };
}
