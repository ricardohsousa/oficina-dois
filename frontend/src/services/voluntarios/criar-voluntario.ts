import { http } from '@/lib/http';

import type { CriarVoluntarioDto, VoluntarioResponseDto } from './types';

export async function criarVoluntario(data: CriarVoluntarioDto): Promise<VoluntarioResponseDto> {
  return http<VoluntarioResponseDto>('/voluntarios', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
