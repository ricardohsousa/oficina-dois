import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type {
  ListarVoluntariosFilters,
  VoluntarioRepository
} from '../../../domain/voluntarios/repositories/voluntario.repository';

export class InMemoryVoluntarioRepository implements VoluntarioRepository {
  private readonly voluntarios = new Map<string, Voluntario>();

  async create(voluntario: Voluntario): Promise<void> {
    this.voluntarios.set(voluntario.id, voluntario);
  }

  async findById(id: string): Promise<Voluntario | null> {
    return this.voluntarios.get(id) ?? null;
  }

  async findByCpf(cpf: string): Promise<Voluntario | null> {
    const normalizedCpf = Voluntario.normalizeCpf(cpf);

    for (const voluntario of this.voluntarios.values()) {
      if (voluntario.cpf === normalizedCpf) {
        return voluntario;
      }
    }

    return null;
  }

  async findByEmail(email: string): Promise<Voluntario | null> {
    const normalizedEmail = Voluntario.normalizeEmail(email);

    for (const voluntario of this.voluntarios.values()) {
      if (voluntario.email === normalizedEmail) {
        return voluntario;
      }
    }

    return null;
  }

  async findMany(filters?: ListarVoluntariosFilters): Promise<Voluntario[]> {
    let items = [...this.voluntarios.values()];

    if (filters?.nome) {
      const normalizedNome = filters.nome.trim().toLowerCase();
      items = items.filter((voluntario) =>
        voluntario.nomeCompleto.toLowerCase().includes(normalizedNome)
      );
    }

    if (filters?.ativo !== undefined) {
      items = items.filter((voluntario) => voluntario.ativo === filters.ativo);
    }

    return items.sort((left, right) => left.nomeCompleto.localeCompare(right.nomeCompleto));
  }

  async update(voluntario: Voluntario): Promise<void> {
    this.voluntarios.set(voluntario.id, voluntario);
  }
}
