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
