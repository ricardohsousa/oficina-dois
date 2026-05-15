import { PrismaClient } from '@prisma/client';

import {
  RegistroAuditoria,
  type RegistroAuditoriaAction,
  type RegistroAuditoriaEntity,
} from '../../../domain/auditoria/entities/registro-auditoria';
import type {
  FiltrarRegistrosAuditoria,
  RegistroAuditoriaRepository,
} from '../../../domain/auditoria/repositories/registro-auditoria.repository';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import { resolvePrismaClient } from '../../database/prisma/transaction-context';

export class PrismaRegistroAuditoriaRepository implements RegistroAuditoriaRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async create(registro: RegistroAuditoria, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prismaClient, context);

    await prisma.registroAuditoria.create({
      data: {
        id: registro.id,
        usuarioId: registro.usuarioId,
        usuarioNome: registro.usuarioNome,
        usuarioEmail: registro.usuarioEmail,
        acao: registro.acao,
        entidade: registro.entidade,
        entidadeId: registro.entidadeId,
        descricao: registro.descricao,
        dadosAnteriores: registro.dadosAnteriores as never,
        dadosNovos: registro.dadosNovos as never,
        createdAt: new Date(registro.createdAt),
      },
    });
  }

  async findMany(
    filters: FiltrarRegistrosAuditoria = {},
    context?: TransactionContext,
  ): Promise<RegistroAuditoria[]> {
    const prisma = resolvePrismaClient(this.prismaClient, context);
    const rows = await prisma.registroAuditoria.findMany({
      where: {
        acao: filters.acao,
        entidade: filters.entidade,
        entidadeId: filters.entidadeId,
        usuarioId: filters.usuarioId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return rows.map((row) =>
      RegistroAuditoria.load({
        id: row.id,
        usuarioId: row.usuarioId,
        usuarioNome: row.usuarioNome,
        usuarioEmail: row.usuarioEmail,
        acao: row.acao as RegistroAuditoriaAction,
        entidade: row.entidade as RegistroAuditoriaEntity,
        entidadeId: row.entidadeId,
        descricao: row.descricao,
        dadosAnteriores: row.dadosAnteriores,
        dadosNovos: row.dadosNovos,
        createdAt: row.createdAt.toISOString(),
      }),
    );
  }
}
