import { http } from '@/lib/http';

import type { VoluntarioResponseDto } from './types';

export async function obterVoluntario(id: string): Promise<VoluntarioResponseDto> {
  return http<VoluntarioResponseDto>(`/voluntarios/${id}`, {
    method: 'GET'
  });
}
