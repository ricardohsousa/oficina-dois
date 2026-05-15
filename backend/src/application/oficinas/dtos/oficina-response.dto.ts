import type { OficinaStatus } from '../../../domain/oficinas/entities/oficina';

export type OficinaResponseDto = {
  id: string;
  nome: string;
  descricao: string;
  status: OficinaStatus;
  dataInicio: string;
  dataFim: string | null;
  createdAt: string;
  updatedAt: string;
};
