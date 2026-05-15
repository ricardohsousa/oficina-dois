import type { TransactionContext } from '../../../shared/database/transaction-manager';
import type { Oficina } from '../entities/oficina';

export interface OficinaRepository {
  create(oficina: Oficina, context?: TransactionContext): Promise<void>;
  findAll(): Promise<Oficina[]>;
  findById(id: string, context?: TransactionContext): Promise<Oficina | null>;
  update(oficina: Oficina, context?: TransactionContext): Promise<void>;
}
