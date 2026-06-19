import { http } from '@/lib/http';

import type { AtualizarOficinaDto, OficinaResponseDto } from './types';

export async function atualizarOficina(id: string, data: AtualizarOficinaDto) {
  return http<OficinaResponseDto>(`/oficinas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}
