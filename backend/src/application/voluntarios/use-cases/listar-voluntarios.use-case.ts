import type { ListarVoluntariosDto } from '../dtos/listar-voluntarios.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';

export class ListarVoluntariosUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(input: ListarVoluntariosDto): Promise<{ items: VoluntarioResponseDto[] }> {
    const voluntarios = await this.voluntarioRepository.findMany(input);

    return {
      items: voluntarios.map(toVoluntarioResponseDto)
    };
  }
}
