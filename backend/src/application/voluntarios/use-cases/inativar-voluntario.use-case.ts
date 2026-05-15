import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';

export class InativarVoluntarioUseCase {
  constructor(
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly atuacaoRepository: AtuacaoRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    id: string,
    actor: AuditoriaActor | null = null,
  ): Promise<VoluntarioResponseDto> {
    return this.transactionManager.runInTransaction(async (context) => {
      const existing = await this.voluntarioRepository.findById(id, context);

      if (!existing) {
        throw new HttpError({
          status: 404,
          title: 'Recurso não encontrado',
          detail: 'Voluntário não encontrado.',
          type: 'https://ellp.local/errors/not-found',
        });
      }

      if (!existing.ativo) {
        throw new HttpError({
          status: 409,
          title: 'Conflito de dados',
          detail: 'O voluntário já está inativo.',
          type: 'https://ellp.local/errors/conflict',
        });
      }

      const today = new Date().toISOString().split('T')[0];

      const voluntario = Voluntario.load({
        id,
        nomeCompleto: existing.nomeCompleto,
        cpf: existing.cpf,
        dataNascimento: existing.dataNascimento,
        email: existing.email,
        telefone: existing.telefone,
        endereco: existing.endereco,
        dataEntrada: existing.dataEntrada,
        dataSaida: today,
        ativo: false,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      });

      await this.atuacaoRepository.reconcileForVoluntarioInactivation(id, today, context);
      await this.voluntarioRepository.update(voluntario, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'voluntario.inativado',
          entidade: 'voluntario',
          entidadeId: voluntario.id,
          descricao: 'Voluntário inativado com desligamento registrado.',
          dadosAnteriores: existing.toJSON(),
          dadosNovos: voluntario.toJSON(),
        },
        context,
      );

      return toVoluntarioResponseDto(voluntario);
    });
  }
}
