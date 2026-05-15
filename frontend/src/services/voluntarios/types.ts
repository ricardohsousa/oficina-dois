// ── Criar ──────────────────────────────────────────────────────────────────
export type CriarVoluntarioDto = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
};

// ── Atualizar ────────────────────────────────────────────────────────────────
export type AtualizarVoluntarioDto = {
  nomeCompleto: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
};

// ── Inativar ─────────────────────────────────────────────────────────────────
export type InativarVoluntarioDto = {
  dataSaida: string;
};

// ── Listar ───────────────────────────────────────────────────────────────────
export type ListarVoluntariosDto = {
  nome?: string;
  ativo?: boolean;
};

export type VoluntarioResponseDto = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
  dataSaida: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListarVoluntariosResponseDto = {
  items: VoluntarioResponseDto[];
};

export type StatusFiltroVoluntario = 'todos' | 'ativos' | 'inativos';

export type VoluntariosFiltersForm = {
  nome: string;
  status: StatusFiltroVoluntario;
};
