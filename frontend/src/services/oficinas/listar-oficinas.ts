import { http } from '@/lib/http';

import type { OficinaResponseDto } from './types';

export async function listarOficinas() {
  return http<OficinaResponseDto[]>('/oficinas', {
    method: 'GET'
  });
}
