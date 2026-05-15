import type { TransactionContext } from '../../../shared/database/transaction-manager';
import type { TermoVoluntariado } from '../entities/termo-voluntariado';

export interface TermoVoluntariadoRepository {
  create(termo: TermoVoluntariado, context?: TransactionContext): Promise<void>;
  findById(id: string, context?: TransactionContext): Promise<TermoVoluntariado | null>;
}
