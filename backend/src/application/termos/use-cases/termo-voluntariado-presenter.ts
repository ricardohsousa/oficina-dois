import type { TermoVoluntariado } from '../../../domain/termos/entities/termo-voluntariado';
import type { TermoVoluntariadoResponseDto } from '../dtos/termo-voluntariado-response.dto';

export const toTermoVoluntariadoResponseDto = (
  termo: TermoVoluntariado,
): TermoVoluntariadoResponseDto => ({
  id: termo.id,
  voluntarioId: termo.voluntarioId,
  nomeArquivo: termo.nomeArquivo,
  mimeType: termo.mimeType,
  downloadUrl: `/termos/${termo.id}/download`,
  createdAt: termo.createdAt,
});
