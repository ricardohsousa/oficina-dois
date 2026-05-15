import type { FiltrarVoluntariosDto } from '../dtos/filtrar-voluntarios.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { toVoluntarioResponseDto } from './voluntario-presenter';

export class ListarVoluntariosUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(filters?: FiltrarVoluntariosDto): Promise<VoluntarioResponseDto[]> {
    const hasFilters = filters && Object.keys(filters).length > 0;
    const voluntarios = hasFilters
      ? await this.voluntarioRepository.findWithFilters(filters)
      : await this.voluntarioRepository.findAll();

    return voluntarios.map(toVoluntarioResponseDto);
  }
}
