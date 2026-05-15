import type { RegistroAuditoriaRepository } from '../../../domain/auditoria/repositories/registro-auditoria.repository';
import type { FiltrarRegistrosAuditoriaDto } from '../dtos/filtrar-registros-auditoria.dto';
import type { RegistroAuditoriaResponseDto } from '../dtos/registro-auditoria-response.dto';
import { toRegistroAuditoriaResponseDto } from './registro-auditoria-presenter';

export class ListarRegistrosAuditoriaUseCase {
  constructor(private readonly registroAuditoriaRepository: RegistroAuditoriaRepository) {}

  async execute(
    filters: FiltrarRegistrosAuditoriaDto = {},
  ): Promise<RegistroAuditoriaResponseDto[]> {
    const registros = await this.registroAuditoriaRepository.findMany(filters);

    return registros.map(toRegistroAuditoriaResponseDto);
  }
}
