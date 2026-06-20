import type { TransactionContext } from '../../../shared/database/transaction-manager';

export interface ProfessorOficinaRepository {
  isProfessorOfOficina(professorId: number, oficinaId: string, context?: TransactionContext): Promise<boolean>;
  findByProfessorId(professorId: number, context?: TransactionContext): Promise<{ oficinaId: string }[]>;
}
