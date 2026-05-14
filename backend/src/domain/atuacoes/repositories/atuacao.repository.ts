import type { Atuacao } from '../entities/atuacao';

export interface AtuacaoRepository {
  create(atuacao: Atuacao): Promise<void>;
  findByVoluntario(voluntarioId: string): Promise<Atuacao[]>;
  findByVoluntarioAndOficina(voluntarioId: string, oficinaId: string): Promise<Atuacao | null>;
  reconcileForVoluntarioInactivation(voluntarioId: string, dataSaida: string): Promise<void>;
}
