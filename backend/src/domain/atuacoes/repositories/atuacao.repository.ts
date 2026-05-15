import type { Atuacao } from '../entities/atuacao';
import type { OficinaStatus } from '../../oficinas/entities/oficina';
import type { TransactionContext } from '../../../shared/database/transaction-manager';

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
  create(atuacao: Atuacao, context?: TransactionContext): Promise<void>;
  findByVoluntario(voluntarioId: string, context?: TransactionContext): Promise<Atuacao[]>;
  findHistoricoByVoluntario(
    voluntarioId: string,
    context?: TransactionContext,
  ): Promise<HistoricoAtuacao[]>;
  findByVoluntarioAndOficina(
    voluntarioId: string,
    oficinaId: string,
    context?: TransactionContext,
  ): Promise<Atuacao | null>;
  reconcileForVoluntarioInactivation(
    voluntarioId: string,
    dataSaida: string,
    context?: TransactionContext,
  ): Promise<void>;
}
