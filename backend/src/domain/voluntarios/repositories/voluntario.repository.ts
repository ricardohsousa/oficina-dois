import type { Voluntario } from '../entities/voluntario';

export interface VoluntarioRepository {
  create(voluntario: Voluntario): Promise<void>;
  findAll(): Promise<Voluntario[]>;
  findById(id: string): Promise<Voluntario | null>;
  findByCpf(cpf: string): Promise<Voluntario | null>;
  findByEmail(email: string): Promise<Voluntario | null>;
  update(voluntario: Voluntario): Promise<void>;
}
