import type { TransactionContext } from '../../../shared/database/transaction-manager';
import type { RegistroAuditoria } from '../entities/registro-auditoria';

export type FiltrarRegistrosAuditoria = {
  acao?: string;
  entidade?: string;
  entidadeId?: string;
  usuarioId?: number;
};

export interface RegistroAuditoriaRepository {
  create(registro: RegistroAuditoria, context?: TransactionContext): Promise<void>;
  findMany(
    filters?: FiltrarRegistrosAuditoria,
    context?: TransactionContext,
  ): Promise<RegistroAuditoria[]>;
}
