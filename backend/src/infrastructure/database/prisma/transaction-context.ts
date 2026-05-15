import type { Prisma, PrismaClient } from '@prisma/client';

import type { TransactionContext, TransactionManager } from '../../../shared/database/transaction-manager';

export type PrismaDbClient = PrismaClient | Prisma.TransactionClient;

type PrismaTransactionCarrier = TransactionContext & {
  transaction: Prisma.TransactionClient;
};

export const resolvePrismaClient = (
  defaultClient: PrismaClient,
  context?: TransactionContext,
): PrismaDbClient => {
  const transactionalClient = (context as PrismaTransactionCarrier | undefined)?.transaction;

  return transactionalClient ?? defaultClient;
};

export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly prismaClient: PrismaClient) {}

  async runInTransaction<T>(operation: (context: TransactionContext) => Promise<T>): Promise<T> {
    return this.prismaClient.$transaction(async (transaction) =>
      operation({ transaction }),
    );
  }
}
