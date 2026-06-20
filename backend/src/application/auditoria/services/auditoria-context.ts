import type {
  RegistroAuditoriaAction,
  RegistroAuditoriaEntity,
} from '../../../domain/auditoria/entities/registro-auditoria';

export type AuditoriaActor = {
  usuarioId: number | null;
  usuarioNome: string | null;
  usuarioEmail: string | null;
  role?: string | null;
};

export type RegistrarAuditoriaInput = {
  actor: AuditoriaActor | null;
  acao: RegistroAuditoriaAction;
  entidade: RegistroAuditoriaEntity;
  entidadeId: string;
  descricao: string;
  dadosAnteriores?: unknown | null;
  dadosNovos?: unknown | null;
};
