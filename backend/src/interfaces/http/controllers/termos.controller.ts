import type { NextFunction, Request, Response } from 'express';

import type { DownloadTermoVoluntariadoUseCase } from '../../../application/termos/use-cases/download-termo-voluntariado.use-case';
import type { GerarTermoVoluntariadoUseCase } from '../../../application/termos/use-cases/gerar-termo-voluntariado.use-case';

export class TermosController {
  constructor(
    private readonly gerarTermoVoluntariadoUseCase: GerarTermoVoluntariadoUseCase,
    private readonly downloadTermoVoluntariadoUseCase: DownloadTermoVoluntariadoUseCase,
  ) {}

  gerar = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const termo = await this.gerarTermoVoluntariadoUseCase.execute(
        String(request.params.voluntarioId ?? ''),
      );

      response.status(201).json(termo);
    } catch (error) {
      next(error);
    }
  };

  download = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = await this.downloadTermoVoluntariadoUseCase.execute(
        String(request.params.termoId ?? ''),
      );

      response.setHeader('Content-Type', file.mimeType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.fileName}"`,
      );
      response.status(200).send(file.content);
    } catch (error) {
      next(error);
    }
  };
}
