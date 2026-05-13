import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class ObterVoluntarioUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(id: string): Promise<VoluntarioResponseDto> {
    const voluntario = await this.voluntarioRepository.findById(id);

    if (!voluntario) {
      throw new NotFoundError('Voluntário não encontrado.');
    }

    return toVoluntarioResponseDto(voluntario);
  }
}
