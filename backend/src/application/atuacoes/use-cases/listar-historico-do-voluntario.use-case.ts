import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { HistoricoAtuacaoResponseDto } from '../dtos/historico-atuacao-response.dto';

export class ListarHistoricoDoVoluntarioUseCase {
  constructor(
    private readonly atuacaoRepository: AtuacaoRepository,
    private readonly voluntarioRepository: VoluntarioRepository,
  ) {}

  async execute(voluntarioId: string): Promise<HistoricoAtuacaoResponseDto[]> {
    const voluntario = await this.voluntarioRepository.findById(voluntarioId);

    if (!voluntario) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    return this.atuacaoRepository.findHistoricoByVoluntario(voluntarioId);
  }
}
