import { PrismaClient } from '@prisma/client';

import { Atuacao } from '../../../domain/atuacoes/entities/atuacao';
import type { OficinaStatus } from '../../../domain/oficinas/entities/oficina';
import type {
  AtuacaoRepository,
  HistoricoAtuacao,
} from '../../../domain/atuacoes/repositories/atuacao.repository';

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

  async findHistoricoByVoluntario(voluntarioId: string): Promise<HistoricoAtuacao[]> {
    const data = await this.prisma.atuacao.findMany({
      where: { voluntarioId },
      include: {
        oficina: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            status: true,
            dataInicio: true,
            dataFim: true,
          },
        },
      },
      orderBy: [{ dataInicio: 'desc' }, { createdAt: 'desc' }],
    });

    return data.map((item) => ({
      id: item.id,
      voluntarioId: item.voluntarioId,
      oficinaId: item.oficinaId,
      dataInicio: item.dataInicio.toISOString().split('T')[0],
      dataFim: item.dataFim?.toISOString().split('T')[0] ?? null,
      cargaHoraria: item.cargaHoraria,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      oficina: {
        id: item.oficina.id,
        nome: item.oficina.nome,
        descricao: item.oficina.descricao,
        status: item.oficina.status as OficinaStatus,
        dataInicio: item.oficina.dataInicio.toISOString().split('T')[0],
        dataFim: item.oficina.dataFim?.toISOString().split('T')[0] ?? null,
      },
    }));
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

  async reconcileForVoluntarioInactivation(
    voluntarioId: string,
    dataSaida: string,
  ): Promise<void> {
    const dataSaidaDate = new Date(dataSaida);
    const updatedAt = new Date();
    const atuacoes = await this.prisma.atuacao.findMany({
      where: { voluntarioId },
      select: {
        id: true,
        dataInicio: true,
        dataFim: true,
      },
    });

    await this.prisma.$transaction(
      atuacoes.flatMap((atuacao) => {
        if (atuacao.dataInicio > dataSaidaDate) {
          return this.prisma.atuacao.delete({
            where: { id: atuacao.id },
          });
        }

        if (atuacao.dataFim === null || atuacao.dataFim > dataSaidaDate) {
          return this.prisma.atuacao.update({
            where: { id: atuacao.id },
            data: {
              dataFim: dataSaidaDate,
              updatedAt,
            },
          });
        }

        return [];
      }),
    );
  }
}
