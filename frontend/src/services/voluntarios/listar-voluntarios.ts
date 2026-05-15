import { http } from '@/lib/http';

import type {
  ListarVoluntariosDto,
  ListarVoluntariosResponseDto,
  StatusFiltroVoluntario,
  VoluntariosFiltersForm
} from './types';

const statusToAtivo = (status: StatusFiltroVoluntario): boolean | undefined => {
  if (status === 'ativos') {
    return true;
  }

  if (status === 'inativos') {
    return false;
  }

  return undefined;
};

export const toListarVoluntariosDto = (
  filters: VoluntariosFiltersForm
): ListarVoluntariosDto => {
  const nome = filters.nome.trim();
  const ativo = statusToAtivo(filters.status);

  return {
    ...(nome ? { nome } : {}),
    ...(ativo !== undefined ? { ativo } : {})
  };
};

export async function listarVoluntarios(
  filters: ListarVoluntariosDto = {}
): Promise<ListarVoluntariosResponseDto> {
  const searchParams = new URLSearchParams();

  if (filters.nome) {
    searchParams.set('nome', filters.nome);
  }

  if (filters.ativo !== undefined) {
    searchParams.set('ativo', String(filters.ativo));
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/voluntarios?${queryString}` : '/voluntarios';

  return http<ListarVoluntariosResponseDto>(url, {
    method: 'GET'
  });
}
