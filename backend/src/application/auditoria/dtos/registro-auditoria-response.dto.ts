export type RegistroAuditoriaResponseDto = {
  id: string;
  usuarioId: number | null;
  usuarioNome: string | null;
  usuarioEmail: string | null;
  acao: string;
  entidade: string;
  entidadeId: string;
  descricao: string;
  dadosAnteriores: unknown | null;
  dadosNovos: unknown | null;
  createdAt: string;
};
