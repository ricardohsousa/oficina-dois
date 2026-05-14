import type { Oficina } from '../entities/oficina';

export interface OficinaRepository {
  create(oficina: Oficina): Promise<void>;
  findAll(): Promise<Oficina[]>;
  findById(id: string): Promise<Oficina | null>;
  update(oficina: Oficina): Promise<void>;
}
