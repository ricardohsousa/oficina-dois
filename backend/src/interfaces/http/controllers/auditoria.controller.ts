import type { NextFunction, Request, Response } from 'express';

import type { ListarRegistrosAuditoriaUseCase } from '../../../application/auditoria/use-cases/listar-registros-auditoria.use-case';
import { HttpError } from '../../../shared/errors/http-error';

export class AuditoriaController {
  constructor(
    private readonly listarRegistrosAuditoriaUseCase: ListarRegistrosAuditoriaUseCase,
  ) {}

  list = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = request.query as Record<string, string | undefined>;
      const usuarioId = query.usuarioId ? Number(query.usuarioId) : undefined;

      if (query.usuarioId && Number.isNaN(usuarioId)) {
        throw new HttpError({
          status: 400,
          title: 'Erro de validação',
          detail: 'O filtro usuarioId deve ser numérico.',
          type: 'https://ellp.local/errors/validation-error',
        });
      }

      const registros = await this.listarRegistrosAuditoriaUseCase.execute({
        acao: query.acao,
        entidade: query.entidade,
        entidadeId: query.entidadeId,
        usuarioId,
      });

      response.status(200).json(registros);
    } catch (error) {
      next(error);
    }
  };
}
