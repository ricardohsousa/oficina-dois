import type { TermoVoluntariado } from '../entities/termo-voluntariado';

export interface TermoVoluntariadoRepository {
  create(termo: TermoVoluntariado): Promise<void>;
  findById(id: string): Promise<TermoVoluntariado | null>;
}
