import { http } from '@/lib/http';

import type { InativarVoluntarioDto, VoluntarioResponseDto } from './types';

export async function inativarVoluntario(
  id: string,
  data: InativarVoluntarioDto
): Promise<VoluntarioResponseDto> {
  return http<VoluntarioResponseDto>(`/voluntarios/${id}/inativar`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}
