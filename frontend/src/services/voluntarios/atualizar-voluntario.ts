import { http } from '@/lib/http';

import type { AtualizarVoluntarioDto, VoluntarioResponseDto } from './types';

export async function atualizarVoluntario(
  id: string,
  data: AtualizarVoluntarioDto
): Promise<VoluntarioResponseDto> {
  return http<VoluntarioResponseDto>(`/voluntarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}
