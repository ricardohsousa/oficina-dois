import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { AtualizarOficinaDto } from '../dtos/atualizar-oficina.dto';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class AtualizarOficinaUseCase {
  constructor(private readonly oficinaRepository: OficinaRepository) {}

  async execute(id: string, input: AtualizarOficinaDto): Promise<OficinaResponseDto> {
    const existing = await this.oficinaRepository.findById(id);

    if (!existing) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Oficina não encontrada.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    const oficina = Oficina.load({
      id,
      nome: input.nome.trim(),
      descricao: input.descricao.trim(),
      status: existing.status,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim ?? null,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    await this.oficinaRepository.update(oficina);

    return toOficinaResponseDto(oficina);
  }
}
