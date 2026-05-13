import type { InativarVoluntarioDto } from '../dtos/inativar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class InativarVoluntarioUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(id: string, input: InativarVoluntarioDto): Promise<VoluntarioResponseDto> {
    const voluntario = await this.voluntarioRepository.findById(id);

    if (!voluntario) {
      throw new NotFoundError('Voluntário não encontrado.');
    }

    if (!voluntario.ativo) {
      throw new ConflictError('O voluntário informado já está inativo.');
    }

    voluntario.inativar(input.dataSaida);

    await this.voluntarioRepository.update(voluntario);

    return toVoluntarioResponseDto(voluntario);
  }
}
