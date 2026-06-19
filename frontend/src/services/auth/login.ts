import { http } from '@/lib/http';

import type { LoginRequestDto, LoginResponseDto } from './types';

export async function login(data: LoginRequestDto) {
  return http<LoginResponseDto>('/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
