import { http } from '@/lib/http';

import type { CriarOficinaDto, OficinaResponseDto } from './types';

export async function criarOficina(data: CriarOficinaDto) {
  return http<OficinaResponseDto>('/oficinas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
