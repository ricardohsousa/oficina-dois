import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class InativarOficinaUseCase {
  constructor(private readonly oficinaRepository: OficinaRepository) {}

  async execute(id: string): Promise<OficinaResponseDto> {
    const existing = await this.oficinaRepository.findById(id);

    if (!existing) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Oficina não encontrada.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    if (!existing.ativa) {
      throw new HttpError({
        status: 409,
        title: 'Conflito de dados',
        detail: 'A oficina já está inativa.',
        type: 'https://ellp.local/errors/conflict',
      });
    }

    const oficina = Oficina.load({
      id,
      nome: existing.nome,
      descricao: existing.descricao,
      status: 'inativa',
      dataInicio: existing.dataInicio,
      dataFim: existing.dataFim,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    await this.oficinaRepository.update(oficina);

    return toOficinaResponseDto(oficina);
  }
}
