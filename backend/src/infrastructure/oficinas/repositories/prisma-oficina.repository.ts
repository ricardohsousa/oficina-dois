import { PrismaClient } from '@prisma/client';

import { Oficina, type OficinaStatus } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';

export class PrismaOficinaRepository implements OficinaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(data: {
    id: string;
    nome: string;
    descricao: string;
    status: string;
    dataInicio: Date;
    dataFim: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Oficina {
    return Oficina.load({
      id: data.id,
      nome: data.nome,
      descricao: data.descricao,
      status: data.status as OficinaStatus,
      dataInicio: data.dataInicio.toISOString().split('T')[0],
      dataFim: data.dataFim?.toISOString().split('T')[0] ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }

  async create(oficina: Oficina): Promise<void> {
    await this.prisma.oficina.create({
      data: {
        id: oficina.id,
        nome: oficina.nome,
        descricao: oficina.descricao,
        status: oficina.status,
        dataInicio: new Date(oficina.dataInicio),
        dataFim: oficina.dataFim ? new Date(oficina.dataFim) : null,
        createdAt: new Date(oficina.createdAt),
        updatedAt: new Date(oficina.updatedAt),
      },
    });
  }

  async findAll(): Promise<Oficina[]> {
    const data = await this.prisma.oficina.findMany({
      orderBy: { nome: 'asc' },
    });

    return data.map((item) => this.mapToDomain(item));
  }

  async findById(id: string): Promise<Oficina | null> {
    const data = await this.prisma.oficina.findUnique({ where: { id } });

    if (!data) return null;

    return this.mapToDomain(data);
  }

  async update(oficina: Oficina): Promise<void> {
    await this.prisma.oficina.update({
      where: { id: oficina.id },
      data: {
        nome: oficina.nome,
        descricao: oficina.descricao,
        status: oficina.status,
        dataInicio: new Date(oficina.dataInicio),
        dataFim: oficina.dataFim ? new Date(oficina.dataFim) : null,
        updatedAt: new Date(oficina.updatedAt),
      },
    });
  }
}
