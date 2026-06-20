import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class InativarOficinaUseCase {
  constructor(
    private readonly oficinaRepository: OficinaRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    id: string,
    actor: AuditoriaActor | null = null,
  ): Promise<OficinaResponseDto> {
    return this.transactionManager.runInTransaction(async (context) => {
      const existing = await this.oficinaRepository.findById(id, context);

      if (!existing) {
        throw new HttpError({
          status: 404,
          title: 'Recurso não encontrado',
          detail: 'Oficina não encontrada.',
          type: 'https://ellp.local/errors/not-found',
        });
      }

      if (!existing.ativa) {
        throw new HttpError({
          status: 409,
          title: 'Conflito de dados',
          detail: 'A oficina já está inativa.',
          type: 'https://ellp.local/errors/conflict',
        });
      }

      const oficina = Oficina.load({
        id,
        nome: existing.nome,
        descricao: existing.descricao,
        ano: existing.ano,
        status: 'encerrada',
        dataInicio: existing.dataInicio,
        dataFim: existing.dataFim,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      });

      await this.oficinaRepository.update(oficina, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'oficina.inativada',
          entidade: 'oficina',
          entidadeId: oficina.id,
          descricao: 'Oficina inativada.',
          dadosAnteriores: existing.toJSON(),
          dadosNovos: oficina.toJSON(),
        },
        context,
      );

      return toOficinaResponseDto(oficina);
    });
  }
}
