import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { AtuacaoResponseDto } from '../dtos/atuacao-response.dto';
import { toAtuacaoResponseDto } from './atuacao-presenter';

export class ListarAtuacoesDoVoluntarioUseCase {
  constructor(
    private readonly atuacaoRepository: AtuacaoRepository,
    private readonly voluntarioRepository: VoluntarioRepository,
  ) {}

  async execute(voluntarioId: string): Promise<AtuacaoResponseDto[]> {
    const voluntario = await this.voluntarioRepository.findById(voluntarioId);

    if (!voluntario) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    const atuacoes = await this.atuacaoRepository.findByVoluntario(voluntarioId);

    return atuacoes.map(toAtuacaoResponseDto);
  }
}
