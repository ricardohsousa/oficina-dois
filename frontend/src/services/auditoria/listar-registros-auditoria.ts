import { http } from '@/lib/http';

import type { ListarRegistrosAuditoriaDto, RegistroAuditoriaResponseDto } from './types';

export async function listarRegistrosAuditoria(filters: ListarRegistrosAuditoriaDto = {}) {
  const params = new URLSearchParams();

  if (filters.acao) {
    params.set('acao', filters.acao);
  }

  if (filters.entidade) {
    params.set('entidade', filters.entidade);
  }

  if (filters.entidadeId) {
    params.set('entidadeId', filters.entidadeId);
  }

  if (filters.usuarioId !== undefined) {
    params.set('usuarioId', String(filters.usuarioId));
  }

  const query = params.toString();

  return http<RegistroAuditoriaResponseDto[]>(query ? `/auditorias?${query}` : '/auditorias', {
    method: 'GET'
  });
}
