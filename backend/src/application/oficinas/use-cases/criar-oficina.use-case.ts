import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { CriarOficinaDto } from '../dtos/criar-oficina.dto';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class CriarOficinaUseCase {
  constructor(private readonly oficinaRepository: OficinaRepository) {}

  async execute(input: CriarOficinaDto): Promise<OficinaResponseDto> {
    const oficina = Oficina.create(input);

    await this.oficinaRepository.create(oficina);

    return toOficinaResponseDto(oficina);
  }
}
