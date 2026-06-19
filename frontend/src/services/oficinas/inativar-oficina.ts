import { http } from '@/lib/http';

import type { OficinaResponseDto } from './types';

export async function inativarOficina(id: string) {
  return http<OficinaResponseDto>(`/oficinas/${id}/inativar`, {
    method: 'PATCH'
  });
}
