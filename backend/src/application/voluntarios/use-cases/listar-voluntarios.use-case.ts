import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';

export class ListarVoluntariosUseCase {
  constructor(private readonly voluntarioRepository: VoluntarioRepository) {}

  async execute(): Promise<VoluntarioResponseDto[]> {
    const voluntarios = await this.voluntarioRepository.findAll();

    return voluntarios.map(toVoluntarioResponseDto);
  }
}
