import { http } from '@/lib/http';

import type { HistoricoAtuacaoResponseDto } from './types';

export async function listarHistoricoDoVoluntario(voluntarioId: string) {
  return http<HistoricoAtuacaoResponseDto[]>(`/voluntarios/${voluntarioId}/historico`, {
    method: 'GET'
  });
}
