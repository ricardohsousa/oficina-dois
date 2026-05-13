import type { Voluntario } from '../entities/voluntario';

export type ListarVoluntariosFilters = {
  nome?: string;
  ativo?: boolean;
};

export interface VoluntarioRepository {
  create(voluntario: Voluntario): Promise<void>;
  findById(id: string): Promise<Voluntario | null>;
  findByCpf(cpf: string): Promise<Voluntario | null>;
  findByEmail(email: string): Promise<Voluntario | null>;
  findMany(filters?: ListarVoluntariosFilters): Promise<Voluntario[]>;
  update(voluntario: Voluntario): Promise<void>;
}
