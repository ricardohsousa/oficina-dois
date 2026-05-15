import type { Atuacao } from '../../../domain/atuacoes/entities/atuacao';
import type { AtuacaoResponseDto } from '../dtos/atuacao-response.dto';

export const toAtuacaoResponseDto = (atuacao: Atuacao): AtuacaoResponseDto =>
  atuacao.toJSON();
