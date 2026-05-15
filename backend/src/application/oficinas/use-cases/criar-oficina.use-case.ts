import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import { Oficina } from '../../../domain/oficinas/entities/oficina';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { TransactionManager } from '../../../shared/database/transaction-manager';
import type { CriarOficinaDto } from '../dtos/criar-oficina.dto';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';

export class CriarOficinaUseCase {
  constructor(
    private readonly oficinaRepository: OficinaRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    input: CriarOficinaDto,
    actor: AuditoriaActor | null = null,
  ): Promise<OficinaResponseDto> {
    return this.transactionManager.runInTransaction(async (context) => {
      const oficina = Oficina.create(input);

      await this.oficinaRepository.create(oficina, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'oficina.criada',
          entidade: 'oficina',
          entidadeId: oficina.id,
          descricao: 'Oficina cadastrada.',
          dadosAnteriores: null,
          dadosNovos: oficina.toJSON(),
        },
        context,
      );

      return toOficinaResponseDto(oficina);
    });
  }
}
