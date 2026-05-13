import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import type { Voluntario } from '../../../domain/voluntarios/entities/voluntario';

export const toVoluntarioResponseDto = (
  voluntario: Voluntario
): VoluntarioResponseDto => voluntario.toJSON();
