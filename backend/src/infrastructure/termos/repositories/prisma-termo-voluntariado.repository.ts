import { PrismaClient } from '@prisma/client';

import { TermoVoluntariado } from '../../../domain/termos/entities/termo-voluntariado';
import type { TermoVoluntariadoRepository } from '../../../domain/termos/repositories/termo-voluntariado.repository';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import { resolvePrismaClient } from '../../database/prisma/transaction-context';

export class PrismaTermoVoluntariadoRepository implements TermoVoluntariadoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(termo: TermoVoluntariado, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prisma, context);

    await prisma.termoVoluntariado.create({
      data: {
        id: termo.id,
        voluntarioId: termo.voluntarioId,
        nomeArquivo: termo.nomeArquivo,
        caminhoArquivo: termo.caminhoArquivo,
        mimeType: termo.mimeType,
        createdAt: new Date(termo.createdAt),
        updatedAt: new Date(termo.updatedAt),
      },
    });
  }

  async findById(id: string, context?: TransactionContext): Promise<TermoVoluntariado | null> {
    const prisma = resolvePrismaClient(this.prisma, context);
    const data = await prisma.termoVoluntariado.findUnique({
      where: { id },
    });

    if (!data) {
      return null;
    }

    return TermoVoluntariado.load({
      id: data.id,
      voluntarioId: data.voluntarioId,
      nomeArquivo: data.nomeArquivo,
      caminhoArquivo: data.caminhoArquivo,
      mimeType: data.mimeType,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }
}
