import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class ListarOficinasUseCase {
  constructor(private readonly oficinaRepository: OficinaRepository) {}

  async execute(): Promise<OficinaResponseDto[]> {
    const oficinas = await this.oficinaRepository.findAll();

    return oficinas.map(toOficinaResponseDto);
  }
}
