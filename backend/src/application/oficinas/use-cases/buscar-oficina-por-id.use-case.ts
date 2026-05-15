import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { HttpError } from '../../../shared/errors/http-error';
import { toOficinaResponseDto } from './oficina-presenter';

export class BuscarOficinaPorIdUseCase {
  constructor(private readonly oficinaRepository: OficinaRepository) {}

  async execute(id: string): Promise<OficinaResponseDto> {
    const oficina = await this.oficinaRepository.findById(id);

    if (!oficina) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Oficina não encontrada.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    return toOficinaResponseDto(oficina);
  }
}
