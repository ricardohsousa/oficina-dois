import type { AtualizarVoluntarioDto } from '../dtos/atualizar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { HttpError } from '../../../shared/errors/http-error';

export class AtualizarVoluntarioUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(
    id: string,
    input: AtualizarVoluntarioDto
  ): Promise<VoluntarioResponseDto> {
    const existing = await this.voluntarioRepository.findById(id);

    if (!existing) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    const cpf = Voluntario.normalizeCpf(input.cpf);
    const email = Voluntario.normalizeEmail(input.email);

    const existingByCpf = await this.voluntarioRepository.findByCpf(cpf);

    if (existingByCpf && existingByCpf.id !== id) {
      throw new ConflictError('Já existe voluntário cadastrado com o CPF informado.');
    }

    const existingByEmail = await this.voluntarioRepository.findByEmail(email);

    if (existingByEmail && existingByEmail.id !== id) {
      throw new ConflictError('Já existe voluntário cadastrado com o e-mail informado.');
    }

    const voluntario = Voluntario.load({
      id,
      nomeCompleto: input.nomeCompleto.trim(),
      cpf,
      dataNascimento: input.dataNascimento,
      email,
      telefone: input.telefone.trim(),
      endereco: input.endereco.trim(),
      dataEntrada: input.dataEntrada,
      dataSaida: existing.dataSaida,
      ativo: existing.ativo,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    await this.voluntarioRepository.update(voluntario);

    return toVoluntarioResponseDto(voluntario);
  }
}
