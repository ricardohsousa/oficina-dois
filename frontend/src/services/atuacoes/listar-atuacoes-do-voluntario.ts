import { http } from '@/lib/http';

import type { AtuacaoResponseDto } from './types';

export async function listarAtuacoesDoVoluntario(voluntarioId: string) {
  return http<AtuacaoResponseDto[]>(`/voluntarios/${voluntarioId}/oficinas`, {
    method: 'GET'
  });
}
