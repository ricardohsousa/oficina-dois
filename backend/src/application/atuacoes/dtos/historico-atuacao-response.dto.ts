import type { OficinaStatus } from '../../../domain/oficinas/entities/oficina';

export type HistoricoAtuacaoResponseDto = {
  id: string;
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim: string | null;
  cargaHoraria: number | null;
  createdAt: string;
  updatedAt: string;
  oficina: {
    id: string;
    nome: string;
    descricao: string;
    status: OficinaStatus;
    dataInicio: string;
    dataFim: string | null;
  };
};
