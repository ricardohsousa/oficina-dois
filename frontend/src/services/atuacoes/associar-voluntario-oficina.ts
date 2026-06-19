import { http } from '@/lib/http';

import type { AssociarVoluntarioOficinaDto, AtuacaoResponseDto } from './types';

export async function associarVoluntarioOficina(voluntarioId: string, data: AssociarVoluntarioOficinaDto) {
  return http<AtuacaoResponseDto>(`/voluntarios/${voluntarioId}/oficinas`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
