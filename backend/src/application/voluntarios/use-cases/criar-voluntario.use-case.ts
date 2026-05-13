import type { CriarVoluntarioDto } from '../dtos/criar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';

export class CriarVoluntarioUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(input: CriarVoluntarioDto): Promise<VoluntarioResponseDto> {
    const cpf = Voluntario.normalizeCpf(input.cpf);
    const email = Voluntario.normalizeEmail(input.email);

    const existingByCpf = await this.voluntarioRepository.findByCpf(cpf);

    if (existingByCpf) {
      throw new ConflictError('Já existe voluntário cadastrado com o CPF informado.');
    }

    const existingByEmail = await this.voluntarioRepository.findByEmail(email);

    if (existingByEmail) {
      throw new ConflictError('Já existe voluntário cadastrado com o e-mail informado.');
    }

    const voluntario = Voluntario.create({
      ...input,
      cpf,
      email
    });

    await this.voluntarioRepository.create(voluntario);

    return toVoluntarioResponseDto(voluntario);
  }
}
