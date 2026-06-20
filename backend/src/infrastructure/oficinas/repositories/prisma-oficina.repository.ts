import { PrismaClient } from '@prisma/client';

import { Oficina, type OficinaStatus } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import { resolvePrismaClient } from '../../database/prisma/transaction-context';

export class PrismaOficinaRepository implements OficinaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(data: {
    id: string;
    nome: string;
    descricao: string;
    ano: number;
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
      ano: data.ano,
      status: data.status as OficinaStatus,
      dataInicio: data.dataInicio.toISOString().split('T')[0],
      dataFim: data.dataFim?.toISOString().split('T')[0] ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }

  async create(oficina: Oficina, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prisma, context);

    await prisma.oficina.create({
      data: {
        id: oficina.id,
        nome: oficina.nome,
        descricao: oficina.descricao,
        ano: oficina.ano,
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

  async findById(id: string, context?: TransactionContext): Promise<Oficina | null> {
    const prisma = resolvePrismaClient(this.prisma, context);
    const data = await prisma.oficina.findUnique({ where: { id } });

    if (!data) return null;

    return this.mapToDomain(data);
  }

  async update(oficina: Oficina, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prisma, context);

    await prisma.oficina.update({
      where: { id: oficina.id },
      data: {
        nome: oficina.nome,
        descricao: oficina.descricao,
        ano: oficina.ano,
        status: oficina.status,
        dataInicio: new Date(oficina.dataInicio),
        dataFim: oficina.dataFim ? new Date(oficina.dataFim) : null,
        updatedAt: new Date(oficina.updatedAt),
      },
    });
  }
}
