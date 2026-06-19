import { http } from '@/lib/http';

import type { TermoVoluntariadoResponseDto } from './types';

export async function gerarTermoVoluntariado(voluntarioId: string) {
  return http<TermoVoluntariadoResponseDto>(`/voluntarios/${voluntarioId}/termo`, {
    method: 'POST'
  });
}
