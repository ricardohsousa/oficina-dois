import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import { Atuacao } from '../../../domain/atuacoes/entities/atuacao';
import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { HttpError } from '../../../shared/errors/http-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';
import type { AssociarVoluntarioOficinaDto } from '../dtos/associar-voluntario-oficina.dto';
import type { AtuacaoResponseDto } from '../dtos/atuacao-response.dto';
import { toAtuacaoResponseDto } from './atuacao-presenter';

export class AssociarVoluntarioOficinaUseCase {
  constructor(
    private readonly atuacaoRepository: AtuacaoRepository,
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly oficinaRepository: OficinaRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    voluntarioId: string,
    input: AssociarVoluntarioOficinaDto,
    actor: AuditoriaActor | null = null,
  ): Promise<AtuacaoResponseDto> {
    return this.transactionManager.runInTransaction(async (context) => {
      const voluntario = await this.voluntarioRepository.findById(voluntarioId, context);

      if (!voluntario) {
        throw new HttpError({
          status: 404,
          title: 'Recurso não encontrado',
          detail: 'Voluntário não encontrado.',
          type: 'https://ellp.local/errors/not-found',
        });
      }

      if (!voluntario.ativo) {
        throw new HttpError({
          status: 409,
          title: 'Operação inválida',
          detail: 'Não é possível associar um voluntário inativo a uma oficina.',
          type: 'https://ellp.local/errors/conflict',
        });
      }

      const oficina = await this.oficinaRepository.findById(input.oficinaId, context);

      if (!oficina) {
        throw new HttpError({
          status: 404,
          title: 'Recurso não encontrado',
          detail: 'Oficina não encontrada.',
          type: 'https://ellp.local/errors/not-found',
        });
      }

      if (!oficina.ativa) {
        throw new HttpError({
          status: 409,
          title: 'Operação inválida',
          detail: 'Não é possível associar um voluntário a uma oficina inativa.',
          type: 'https://ellp.local/errors/conflict',
        });
      }

      const existing = await this.atuacaoRepository.findByVoluntarioAndOficina(
        voluntarioId,
        input.oficinaId,
        context,
      );

      if (existing) {
        throw new ConflictError('O voluntário já está associado a esta oficina.');
      }

      const atuacao = Atuacao.create({
        voluntarioId,
        oficinaId: input.oficinaId,
        dataInicio: input.dataInicio,
        dataFim: input.dataFim,
        cargaHoraria: input.cargaHoraria,
      });

      await this.atuacaoRepository.create(atuacao, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'atuacao.associada',
          entidade: 'atuacao',
          entidadeId: atuacao.id,
          descricao: 'Voluntário associado a uma oficina.',
          dadosAnteriores: null,
          dadosNovos: atuacao.toJSON(),
        },
        context,
      );

      return toAtuacaoResponseDto(atuacao);
    });
  }
}
