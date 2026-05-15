import { HttpError } from '../../../shared/errors/http-error';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';

export class BuscarVoluntarioPorIdUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(id: string): Promise<VoluntarioResponseDto> {
    const voluntario = await this.voluntarioRepository.findById(id);

    if (!voluntario) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    return toVoluntarioResponseDto(voluntario);
  }
}
