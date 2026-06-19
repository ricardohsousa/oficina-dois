export type OficinaStatus = 'ativa' | 'inativa';

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

export type CriarOficinaDto = {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string;
};

export type AtualizarOficinaDto = CriarOficinaDto;
