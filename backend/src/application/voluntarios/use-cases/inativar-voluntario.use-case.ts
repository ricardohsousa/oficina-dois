import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { HttpError } from '../../../shared/errors/http-error';

export class InativarVoluntarioUseCase {
  constructor(
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly atuacaoRepository: AtuacaoRepository,
  ) {}

  async execute(id: string): Promise<VoluntarioResponseDto> {
    const existing = await this.voluntarioRepository.findById(id);

    if (!existing) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    if (!existing.ativo) {
      throw new HttpError({
        status: 409,
        title: 'Conflito de dados',
        detail: 'O voluntário já está inativo.',
        type: 'https://ellp.local/errors/conflict',
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const voluntario = Voluntario.load({
      id,
      nomeCompleto: existing.nomeCompleto,
      cpf: existing.cpf,
      dataNascimento: existing.dataNascimento,
      email: existing.email,
      telefone: existing.telefone,
      endereco: existing.endereco,
      dataEntrada: existing.dataEntrada,
      dataSaida: today,
      ativo: false,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    await this.atuacaoRepository.reconcileForVoluntarioInactivation(id, today);
    await this.voluntarioRepository.update(voluntario);

    return toVoluntarioResponseDto(voluntario);
  }
}
