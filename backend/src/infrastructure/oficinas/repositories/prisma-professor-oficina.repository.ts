import type { PrismaClient } from '@prisma/client';

import type { ProfessorOficinaRepository } from '../../../domain/oficinas/repositories/professor-oficina.repository';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import { resolvePrismaClient } from '../../database/prisma/transaction-context';

export class PrismaProfessorOficinaRepository implements ProfessorOficinaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async isProfessorOfOficina(
    professorId: number,
    oficinaId: string,
    context?: TransactionContext,
  ): Promise<boolean> {
    const client = resolvePrismaClient(this.prisma, context);

    const record = await (client as PrismaClient).professorOficina.findUnique({
      where: {
        professorId_oficinaId: {
          professorId,
          oficinaId,
        },
      },
    });

    return record !== null;
  }

  async findByProfessorId(
    professorId: number,
    context?: TransactionContext,
  ): Promise<{ oficinaId: string }[]> {
    const client = resolvePrismaClient(this.prisma, context);

    const records = await (client as PrismaClient).professorOficina.findMany({
      where: {
        professorId,
      },
      select: {
        oficinaId: true,
      },
    });

    return records;
  }
}
