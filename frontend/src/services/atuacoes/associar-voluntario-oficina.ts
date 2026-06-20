import { http } from '@/lib/http';

interface AssociarVoluntarioOficinaDto {
  oficinaId: string;
  dataInicio: string;
  dataFim?: string;
  cargaHoraria?: number;
}

interface AtuacaoResponseDto {
  id: string;
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim: string | null;
  cargaHoraria: number | null;
  createdAt: string;
  updatedAt: string;
}

export async function associarVoluntarioOficina(
  voluntarioId: string,
  data: AssociarVoluntarioOficinaDto,
): Promise<AtuacaoResponseDto> {
  return http<AtuacaoResponseDto>(`/voluntarios/${voluntarioId}/oficinas`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
