import type { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';

export const toOficinaResponseDto = (oficina: Oficina): OficinaResponseDto =>
  oficina.toJSON();
