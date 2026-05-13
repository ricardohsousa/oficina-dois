import type { NextFunction, Request, Response } from 'express';

import type { AtualizarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/atualizar-voluntario.use-case';
import type { CriarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/criar-voluntario.use-case';
import type { InativarVoluntarioUseCase } from '../../../application/voluntarios/use-cases/inativar-voluntario.use-case';
import type { ListarVoluntariosUseCase } from '../../../application/voluntarios/use-cases/listar-voluntarios.use-case';
import type { ObterVoluntarioUseCase } from '../../../application/voluntarios/use-cases/obter-voluntario.use-case';
import {
  parseListarVoluntariosQuery,
  parseRequiredId,
  validateCreateVoluntario,
  validateInativarVoluntario,
  validateUpdateVoluntario
} from '../../validations/voluntarios-http.validator';

export class VoluntariosController {
  constructor(
    private readonly criarVoluntarioUseCase: CriarVoluntarioUseCase,
    private readonly listarVoluntariosUseCase: ListarVoluntariosUseCase,
    private readonly obterVoluntarioUseCase: ObterVoluntarioUseCase,
    private readonly atualizarVoluntarioUseCase: AtualizarVoluntarioUseCase,
    private readonly inativarVoluntarioUseCase: InativarVoluntarioUseCase
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

  list = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const query = parseListarVoluntariosQuery(request.query);
      const voluntarios = await this.listarVoluntariosUseCase.execute(query);

      response.status(200).json(voluntarios);
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseRequiredId(request.params.id);
      const voluntario = await this.obterVoluntarioUseCase.execute(id);

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseRequiredId(request.params.id);
      const input = validateUpdateVoluntario(request.body);
      const voluntario = await this.atualizarVoluntarioUseCase.execute(id, input);

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };

  inactivate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseRequiredId(request.params.id);
      const input = validateInativarVoluntario(request.body);
      const voluntario = await this.inativarVoluntarioUseCase.execute(id, input);

      response.status(200).json(voluntario);
    } catch (error) {
      next(error);
    }
  };
}
