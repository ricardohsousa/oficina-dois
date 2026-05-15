import { RegistroAuditoria } from '../../../domain/auditoria/entities/registro-auditoria';
import type { RegistroAuditoriaRepository } from '../../../domain/auditoria/repositories/registro-auditoria.repository';
import type { TransactionContext } from '../../../shared/database/transaction-manager';
import type { RegistrarAuditoriaInput } from '../services/auditoria-context';
import { redactAuditoriaPayload } from '../services/redact-auditoria-payload';

export class RegistrarAuditoriaService {
  constructor(private readonly registroAuditoriaRepository: RegistroAuditoriaRepository) {}

  async execute(input: RegistrarAuditoriaInput, context?: TransactionContext): Promise<void> {
    const registro = RegistroAuditoria.create({
      usuarioId: input.actor?.usuarioId ?? null,
      usuarioNome: input.actor?.usuarioNome ?? null,
      usuarioEmail: input.actor?.usuarioEmail ?? null,
      acao: input.acao,
      entidade: input.entidade,
      entidadeId: input.entidadeId,
      descricao: input.descricao,
      dadosAnteriores: redactAuditoriaPayload(input.dadosAnteriores ?? null),
      dadosNovos: redactAuditoriaPayload(input.dadosNovos ?? null),
    });

    await this.registroAuditoriaRepository.create(registro, context);
  }
}
