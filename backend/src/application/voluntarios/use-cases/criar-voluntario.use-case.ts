import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import type { CriarVoluntarioDto } from '../dtos/criar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';

export class CriarVoluntarioUseCase {
  constructor(
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    input: CriarVoluntarioDto,
    actor: AuditoriaActor | null = null,
  ): Promise<VoluntarioResponseDto> {
    return this.transactionManager.runInTransaction(async (context) => {
      const cpf = Voluntario.normalizeCpf(input.cpf);
      const email = Voluntario.normalizeEmail(input.email);

      const existingByCpf = await this.voluntarioRepository.findByCpf(cpf, context);

      if (existingByCpf) {
        throw new ConflictError('Já existe voluntário cadastrado com o CPF informado.');
      }

      const existingByEmail = await this.voluntarioRepository.findByEmail(email, context);

      if (existingByEmail) {
        throw new ConflictError('Já existe voluntário cadastrado com o e-mail informado.');
      }

      const voluntario = Voluntario.create({
        ...input,
        cpf,
        email
      });

      await this.voluntarioRepository.create(voluntario, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'voluntario.criado',
          entidade: 'voluntario',
          entidadeId: voluntario.id,
          descricao: 'Voluntário cadastrado.',
          dadosAnteriores: null,
          dadosNovos: voluntario.toJSON(),
        },
        context,
      );

      return toVoluntarioResponseDto(voluntario);
    });
  }
}
