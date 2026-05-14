import type { TermoVoluntariadoRepository } from '../../../domain/termos/repositories/termo-voluntariado.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { TermoFileStorage } from '../services/termo-file-storage';

export type DownloadTermoVoluntariadoResult = {
  fileName: string;
  mimeType: string;
  content: Buffer;
};

export class DownloadTermoVoluntariadoUseCase {
  constructor(
    private readonly termoRepository: TermoVoluntariadoRepository,
    private readonly termoFileStorage: TermoFileStorage,
  ) {}

  async execute(termoId: string): Promise<DownloadTermoVoluntariadoResult> {
    const termo = await this.termoRepository.findById(termoId);

    if (!termo) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Termo de voluntariado não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    try {
      const content = await this.termoFileStorage.read(termo.caminhoArquivo);

      return {
        fileName: termo.nomeArquivo,
        mimeType: termo.mimeType,
        content,
      };
    } catch {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Arquivo do termo de voluntariado não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }
  }
}
