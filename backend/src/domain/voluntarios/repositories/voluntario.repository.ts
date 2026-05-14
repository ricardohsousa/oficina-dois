import type { Voluntario } from '../entities/voluntario';

export interface VoluntarioRepository {
  create(voluntario: Voluntario): Promise<void>;
  findByCpf(cpf: string): Promise<Voluntario | null>;
  findByEmail(email: string): Promise<Voluntario | null>;
}
