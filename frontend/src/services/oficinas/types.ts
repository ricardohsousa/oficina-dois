export type OficinaStatus = 'ativa' | 'encerrada' | 'cancelada';
export type AtividadeStatus = 'planejada' | 'em_progresso' | 'concluida' | 'cancelada';

export type ProfessorDto = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

export type VoluntarioDto = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  ativo: boolean;
};

export type AtividadeMesDto = {
  id: string;
  mes: number;
  descricao?: string;
};

export type AtividadeDto = {
  id: string;
  nome: string;
  descricao?: string;
  status: AtividadeStatus;
  meses: AtividadeMesDto[];
  createdAt: string;
  updatedAt: string;
};

export type OficinaResponseDto = {
  id: string;
  nome: string;
  descricao: string;
  ano: number;
  status: OficinaStatus;
  dataInicio: string;
  dataFim: string | null;
  atividades?: AtividadeDto[];
  professores?: ProfessorDto[];
  voluntarios?: VoluntarioDto[];
  createdAt: string;
  updatedAt: string;
};

export type CriarOficinaDto = {
  nome: string;
  descricao: string;
  ano?: number;
  dataInicio: string;
  dataFim?: string;
};

export type AtualizarOficinaDto = CriarOficinaDto;
