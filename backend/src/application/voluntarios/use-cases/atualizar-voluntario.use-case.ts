import type { AtualizarVoluntarioDto } from '../dtos/atualizar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class AtualizarVoluntarioUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(id: string, input: AtualizarVoluntarioDto): Promise<VoluntarioResponseDto> {
    const voluntario = await this.voluntarioRepository.findById(id);

    if (!voluntario) {
      throw new NotFoundError('Voluntário não encontrado.');
    }

    const normalizedEmail = Voluntario.normalizeEmail(input.email);
    const existingByEmail = await this.voluntarioRepository.findByEmail(normalizedEmail);

    if (existingByEmail && existingByEmail.id !== voluntario.id) {
      throw new ConflictError('Já existe voluntário cadastrado com o e-mail informado.');
    }

    voluntario.atualizar({
      ...input,
      email: normalizedEmail
    });

    await this.voluntarioRepository.update(voluntario);

    return toVoluntarioResponseDto(voluntario);
  }
}
