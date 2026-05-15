import type { FiltrarVoluntariosDto } from '../../../application/voluntarios/dtos/filtrar-voluntarios.dto';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import type { Voluntario } from '../entities/voluntario';

export interface VoluntarioRepository {
  create(voluntario: Voluntario, context?: TransactionContext): Promise<void>;
  findAll(): Promise<Voluntario[]>;
  findWithFilters(filters: FiltrarVoluntariosDto): Promise<Voluntario[]>;
  findById(id: string, context?: TransactionContext): Promise<Voluntario | null>;
  findByCpf(cpf: string, context?: TransactionContext): Promise<Voluntario | null>;
  findByEmail(email: string, context?: TransactionContext): Promise<Voluntario | null>;
  update(voluntario: Voluntario, context?: TransactionContext): Promise<void>;
}
