import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import { HttpError } from '../../../shared/errors/http-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';
import type { AtualizarOficinaDto } from '../dtos/atualizar-oficina.dto';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class AtualizarOficinaUseCase {
  constructor(
    private readonly oficinaRepository: OficinaRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    id: string,
    input: AtualizarOficinaDto,
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

      const oficina = Oficina.load({
        id,
        nome: input.nome.trim(),
        descricao: input.descricao.trim(),
        status: existing.status,
        dataInicio: input.dataInicio,
        dataFim: input.dataFim ?? null,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      });

      await this.oficinaRepository.update(oficina, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'oficina.atualizada',
          entidade: 'oficina',
          entidadeId: oficina.id,
          descricao: 'Dados da oficina atualizados.',
          dadosAnteriores: existing.toJSON(),
          dadosNovos: oficina.toJSON(),
        },
        context,
      );

      return toOficinaResponseDto(oficina);
    });
  }
}
