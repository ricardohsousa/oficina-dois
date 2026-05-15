import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import type { AtualizarVoluntarioDto } from '../dtos/atualizar-voluntario.dto';
import type { VoluntarioResponseDto } from '../dtos/voluntario-response.dto';
import { toVoluntarioResponseDto } from './voluntario-presenter';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { HttpError } from '../../../shared/errors/http-error';
import type { TransactionManager } from '../../../shared/database/transaction-manager';

export class AtualizarVoluntarioUseCase {
  constructor(
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    id: string,
    input: AtualizarVoluntarioDto,
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

      const cpf = Voluntario.normalizeCpf(input.cpf);
      const email = Voluntario.normalizeEmail(input.email);

      const existingByCpf = await this.voluntarioRepository.findByCpf(cpf, context);

      if (existingByCpf && existingByCpf.id !== id) {
        throw new ConflictError('Já existe voluntário cadastrado com o CPF informado.');
      }

      const existingByEmail = await this.voluntarioRepository.findByEmail(email, context);

      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictError('Já existe voluntário cadastrado com o e-mail informado.');
      }

      const voluntario = Voluntario.load({
        id,
        nomeCompleto: input.nomeCompleto,
        cpf,
        dataNascimento: input.dataNascimento,
        email,
        telefone: input.telefone,
        endereco: input.endereco,
        dataEntrada: input.dataEntrada,
        dataSaida: existing.dataSaida,
        ativo: existing.ativo,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      });

      await this.voluntarioRepository.update(voluntario, context);
      await this.registrarAuditoriaService.execute(
        {
          actor,
          acao: 'voluntario.atualizado',
          entidade: 'voluntario',
          entidadeId: voluntario.id,
          descricao: 'Dados do voluntário atualizados.',
          dadosAnteriores: existing.toJSON(),
          dadosNovos: voluntario.toJSON(),
        },
        context,
      );

      return toVoluntarioResponseDto(voluntario);
    });
  }
}
