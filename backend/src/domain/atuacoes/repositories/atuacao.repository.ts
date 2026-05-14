import type { Atuacao } from '../entities/atuacao';
import type { OficinaStatus } from '../../oficinas/entities/oficina';

export type HistoricoAtuacao = {
  id: string;
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim: string | null;
  cargaHoraria: number | null;
  createdAt: string;
  updatedAt: string;
  oficina: {
    id: string;
    nome: string;
    descricao: string;
    status: OficinaStatus;
    dataInicio: string;
    dataFim: string | null;
  };
};

export interface AtuacaoRepository {
  create(atuacao: Atuacao): Promise<void>;
  findByVoluntario(voluntarioId: string): Promise<Atuacao[]>;
  findHistoricoByVoluntario(voluntarioId: string): Promise<HistoricoAtuacao[]>;
  findByVoluntarioAndOficina(voluntarioId: string, oficinaId: string): Promise<Atuacao | null>;
  reconcileForVoluntarioInactivation(voluntarioId: string, dataSaida: string): Promise<void>;
}
