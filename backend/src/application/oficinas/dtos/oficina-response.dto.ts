import type { OficinaStatus } from '../../../domain/oficinas/entities/oficina';

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
  status: string;
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
  professores?: ProfessorDto[];
  voluntarios?: VoluntarioDto[];
  atividades?: AtividadeDto[];
  createdAt: string;
  updatedAt: string;
};
