import { http } from '@/lib/http';

import type { AuthenticatedUser } from './types';

export async function obterUsuarioAutenticado() {
  return http<AuthenticatedUser>('/auth/me', {
    method: 'GET'
  });
}
