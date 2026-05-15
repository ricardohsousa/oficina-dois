import { toAuditoriaActor } from '../../../application/auditoria/services/to-auditoria-actor';
import type { NextFunction, Request, Response } from 'express';

import type { AtualizarOficinaUseCase } from '../../../application/oficinas/use-cases/atualizar-oficina.use-case';
import type { BuscarOficinaPorIdUseCase } from '../../../application/oficinas/use-cases/buscar-oficina-por-id.use-case';
import type { CriarOficinaUseCase } from '../../../application/oficinas/use-cases/criar-oficina.use-case';
import type { InativarOficinaUseCase } from '../../../application/oficinas/use-cases/inativar-oficina.use-case';
import type { ListarOficinasUseCase } from '../../../application/oficinas/use-cases/listar-oficinas.use-case';
import {
  validateCreateOficina,
  validateUpdateOficina,
} from '../../validations/oficinas-http.validator';
import type { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export class OficinasController {
  constructor(
    private readonly criarOficinaUseCase: CriarOficinaUseCase,
    private readonly atualizarOficinaUseCase: AtualizarOficinaUseCase,
    private readonly listarOficinasUseCase: ListarOficinasUseCase,
    private readonly buscarOficinaPorIdUseCase: BuscarOficinaPorIdUseCase,
    private readonly inativarOficinaUseCase: InativarOficinaUseCase,
  ) {}

  list = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const oficinas = await this.listarOficinasUseCase.execute();

      response.status(200).json(oficinas);
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const oficina = await this.buscarOficinaPorIdUseCase.execute(
        String(request.params.id ?? ''),
      );

      response.status(200).json(oficina);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validateCreateOficina(request.body);
      const oficina = await this.criarOficinaUseCase.execute(
        input,
        toAuditoriaActor((request as AuthenticatedRequest).auth),
      );

      response.status(201).json(oficina);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validateUpdateOficina(request.body);
      const oficina = await this.atualizarOficinaUseCase.execute(
        String(request.params.id ?? ''),
        input,
        toAuditoriaActor((request as AuthenticatedRequest).auth),
      );

      response.status(200).json(oficina);
    } catch (error) {
      next(error);
    }
  };

  inativar = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const oficina = await this.inativarOficinaUseCase.execute(
        String(request.params.id ?? ''),
        toAuditoriaActor((request as AuthenticatedRequest).auth),
      );

      response.status(200).json(oficina);
    } catch (error) {
      next(error);
    }
  };
}
