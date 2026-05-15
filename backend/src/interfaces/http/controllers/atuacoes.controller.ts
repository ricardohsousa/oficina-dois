import { toAuditoriaActor } from '../../../application/auditoria/services/to-auditoria-actor';
import type { NextFunction, Request, Response } from 'express';

import type { AssociarVoluntarioOficinaUseCase } from '../../../application/atuacoes/use-cases/associar-voluntario-oficina.use-case';
import type { ListarHistoricoDoVoluntarioUseCase } from '../../../application/atuacoes/use-cases/listar-historico-do-voluntario.use-case';
import type { ListarAtuacoesDoVoluntarioUseCase } from '../../../application/atuacoes/use-cases/listar-atuacoes-do-voluntario.use-case';
import { validateAssociarVoluntarioOficina } from '../../validations/atuacoes-http.validator';
import type { AuthenticatedRequest } from '../middlewares/authentication.middleware';

export class AtuacoesController {
  constructor(
    private readonly associarVoluntarioOficinaUseCase: AssociarVoluntarioOficinaUseCase,
    private readonly listarAtuacoesDoVoluntarioUseCase: ListarAtuacoesDoVoluntarioUseCase,
    private readonly listarHistoricoDoVoluntarioUseCase: ListarHistoricoDoVoluntarioUseCase,
  ) {}

  associar = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const voluntarioId = String(request.params.voluntarioId ?? '');
      const input = validateAssociarVoluntarioOficina(request.body);
      const atuacao = await this.associarVoluntarioOficinaUseCase.execute(
        voluntarioId,
        input,
        toAuditoriaActor((request as AuthenticatedRequest).auth),
      );

      response.status(201).json(atuacao);
    } catch (error) {
      next(error);
    }
  };

  listarPorVoluntario = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const voluntarioId = String(request.params.voluntarioId ?? '');
      const atuacoes = await this.listarAtuacoesDoVoluntarioUseCase.execute(voluntarioId);

      response.status(200).json(atuacoes);
    } catch (error) {
      next(error);
    }
  };

  listarHistorico = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const voluntarioId = String(request.params.voluntarioId ?? '');
      const historico = await this.listarHistoricoDoVoluntarioUseCase.execute(voluntarioId);

      response.status(200).json(historico);
    } catch (error) {
      next(error);
    }
  };
}
