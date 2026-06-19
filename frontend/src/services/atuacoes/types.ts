import type { OficinaStatus } from '@/services/oficinas/types';

export type AssociarVoluntarioOficinaDto = {
  oficinaId: string;
  dataInicio: string;
  dataFim?: string;
  cargaHoraria?: number;
};

export type AtuacaoResponseDto = {
  id: string;
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim: string | null;
  cargaHoraria: number | null;
  createdAt: string;
  updatedAt: string;
};

export type HistoricoAtuacaoResponseDto = AtuacaoResponseDto & {
  oficina: {
    id: string;
    nome: string;
    descricao: string;
    status: OficinaStatus;
    dataInicio: string;
    dataFim: string | null;
  };
};
