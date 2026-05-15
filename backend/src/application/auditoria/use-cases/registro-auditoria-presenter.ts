import type { RegistroAuditoria } from '../../../domain/auditoria/entities/registro-auditoria';
import type { RegistroAuditoriaResponseDto } from '../dtos/registro-auditoria-response.dto';

export const toRegistroAuditoriaResponseDto = (
  registro: RegistroAuditoria,
): RegistroAuditoriaResponseDto => ({
  id: registro.id,
  usuarioId: registro.usuarioId,
  usuarioNome: registro.usuarioNome,
  usuarioEmail: registro.usuarioEmail,
  acao: registro.acao,
  entidade: registro.entidade,
  entidadeId: registro.entidadeId,
  descricao: registro.descricao,
  dadosAnteriores: registro.dadosAnteriores,
  dadosNovos: registro.dadosNovos,
  createdAt: registro.createdAt,
});
