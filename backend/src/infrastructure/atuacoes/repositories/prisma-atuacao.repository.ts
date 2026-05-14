import { PrismaClient } from '@prisma/client';

import { Atuacao } from '../../../domain/atuacoes/entities/atuacao';
import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';

export class PrismaAtuacaoRepository implements AtuacaoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(data: {
    id: string;
    voluntarioId: string;
    oficinaId: string;
    dataInicio: Date;
    dataFim: Date | null;
    cargaHoraria: number | null;
    createdAt: Date;
    updatedAt: Date;
  }): Atuacao {
    return Atuacao.load({
      id: data.id,
      voluntarioId: data.voluntarioId,
      oficinaId: data.oficinaId,
      dataInicio: data.dataInicio.toISOString().split('T')[0],
      dataFim: data.dataFim?.toISOString().split('T')[0] ?? null,
      cargaHoraria: data.cargaHoraria,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }

  async create(atuacao: Atuacao): Promise<void> {
    await this.prisma.atuacao.create({
      data: {
        id: atuacao.id,
        voluntarioId: atuacao.voluntarioId,
        oficinaId: atuacao.oficinaId,
        dataInicio: new Date(atuacao.dataInicio),
        dataFim: atuacao.dataFim ? new Date(atuacao.dataFim) : null,
        cargaHoraria: atuacao.cargaHoraria,
        createdAt: new Date(atuacao.createdAt),
        updatedAt: new Date(atuacao.updatedAt),
      },
    });
  }

  async findByVoluntario(voluntarioId: string): Promise<Atuacao[]> {
    const data = await this.prisma.atuacao.findMany({
      where: { voluntarioId },
      orderBy: { dataInicio: 'asc' },
    });

    return data.map((item) => this.mapToDomain(item));
  }

  async findByVoluntarioAndOficina(
    voluntarioId: string,
    oficinaId: string,
  ): Promise<Atuacao | null> {
    const data = await this.prisma.atuacao.findUnique({
      where: { voluntarioId_oficinaId: { voluntarioId, oficinaId } },
    });

    if (!data) return null;

    return this.mapToDomain(data);
  }
}
