import { randomUUID } from 'node:crypto';

import type { RegistrarAuditoriaService } from '../../auditoria/use-cases/registrar-auditoria.service';
import type { AuditoriaActor } from '../../auditoria/services/auditoria-context';
import type { AtuacaoRepository } from '../../../domain/atuacoes/repositories/atuacao.repository';
import type { TermoVoluntariadoRepository } from '../../../domain/termos/repositories/termo-voluntariado.repository';
import { TermoVoluntariado } from '../../../domain/termos/entities/termo-voluntariado';
import type { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import type { TransactionManager } from '../../../shared/database/transaction-manager';
import { HttpError } from '../../../shared/errors/http-error';
import { ValidationError } from '../../../shared/errors/validation-error';
import type { TermoVoluntariadoResponseDto } from '../dtos/termo-voluntariado-response.dto';
import type { TermoFileStorage } from '../services/termo-file-storage';
import type { TermoPdfGenerator } from '../services/termo-pdf-generator';
import { toTermoVoluntariadoResponseDto } from './termo-voluntariado-presenter';

const PROJECT_NAME = 'ELLP - Ensino Lúdico de Lógica e Programação';

export class GerarTermoVoluntariadoUseCase {
  constructor(
    private readonly voluntarioRepository: VoluntarioRepository,
    private readonly atuacaoRepository: AtuacaoRepository,
    private readonly termoRepository: TermoVoluntariadoRepository,
    private readonly termoPdfGenerator: TermoPdfGenerator,
    private readonly termoFileStorage: TermoFileStorage,
    private readonly transactionManager: TransactionManager,
    private readonly registrarAuditoriaService: RegistrarAuditoriaService,
  ) {}

  async execute(
    voluntarioId: string,
    actor: AuditoriaActor | null = null,
  ): Promise<TermoVoluntariadoResponseDto> {
    const voluntario = await this.voluntarioRepository.findById(voluntarioId);

    if (!voluntario) {
      throw new HttpError({
        status: 404,
        title: 'Recurso não encontrado',
        detail: 'Voluntário não encontrado.',
        type: 'https://ellp.local/errors/not-found',
      });
    }

    this.validateRequiredFields(voluntario.toJSON());

    const historico = await this.atuacaoRepository.findHistoricoByVoluntario(voluntarioId);
    const dataGeracao = new Date().toISOString().split('T')[0];
    const pdf = await this.termoPdfGenerator.generate({
      voluntario: {
        id: voluntario.id,
        nomeCompleto: voluntario.nomeCompleto,
        cpf: voluntario.cpf,
        dataNascimento: voluntario.dataNascimento,
        email: voluntario.email,
        telefone: voluntario.telefone,
        endereco: voluntario.endereco,
        dataEntrada: voluntario.dataEntrada,
        isEstudante: true,
        curso: 'Ciência da Computação',
        periodo: 'Noturno',
        nacionalidade: 'Brasileira',
        cidade: 'Cornélio Procópio',
        estado: 'PR',
        ra: undefined,
      },
      coordenador: {
        nome: actor?.usuarioNome || 'Coordenação ELLP',
        cpf: '---',
        departamento: 'DIREXT-CP',
        telefone: '(43) 3520-XXXX',
        email: actor?.usuarioEmail || 'coordenacao@utfpr.edu.br',
      },
      projetoNome: PROJECT_NAME,
      dataGeracao,
      descricaoAtuacao: this.buildAtuacaoDescription(historico),
    });

    const fileName = this.buildFileName(voluntario.nomeCompleto, dataGeracao);
    const path = await this.termoFileStorage.save(fileName, pdf);
    const termo = TermoVoluntariado.create({
      voluntarioId,
      nomeArquivo: fileName,
      caminhoArquivo: path,
    });

    try {
      return await this.transactionManager.runInTransaction(async (context) => {
        await this.termoRepository.create(termo, context);
        await this.registrarAuditoriaService.execute(
          {
            actor,
            acao: 'termo.gerado',
            entidade: 'termo_voluntariado',
            entidadeId: termo.id,
            descricao: 'Termo de voluntariado gerado em PDF.',
            dadosAnteriores: null,
            dadosNovos: termo.toJSON(),
          },
          context,
        );

        return toTermoVoluntariadoResponseDto(termo);
      });
    } catch (error) {
      await this.termoFileStorage.delete(path);
      throw error;
    }
  }

  private validateRequiredFields(voluntario: {
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    endereco: string;
    dataEntrada: string;
  }): void {
    const requiredEntries = [
      ['nomeCompleto', voluntario.nomeCompleto],
      ['cpf', voluntario.cpf],
      ['dataNascimento', voluntario.dataNascimento],
      ['email', voluntario.email],
      ['telefone', voluntario.telefone],
      ['endereco', voluntario.endereco],
      ['dataEntrada', voluntario.dataEntrada],
    ];

    const errors = requiredEntries
      .filter(([, value]) => !value.trim())
      .map(([field]) => ({
        field,
        message: 'Campo obrigatório para geração do termo.',
      }));

    if (errors.length > 0) {
      throw new ValidationError(
        'Existem dados obrigatórios pendentes para gerar o termo de voluntariado.',
        errors,
      );
    }
  }

  private buildAtuacaoDescription(
    historico: Awaited<ReturnType<AtuacaoRepository['findHistoricoByVoluntario']>>,
  ): string {
    if (historico.length === 0) {
      return 'Sem histórico de atuação registrado até a data de geração.';
    }

    return historico
      .map((item, index) => {
        const periodo = `${item.dataInicio} a ${item.dataFim ?? 'atual'}`;
        const cargaHoraria = item.cargaHoraria
          ? `, carga horária: ${item.cargaHoraria}h`
          : '';

        return `${index + 1}. ${item.oficina.nome} (${periodo}${cargaHoraria})`;
      })
      .join('\n');
  }

  private buildFileName(nomeCompleto: string, dataGeracao: string): string {
    const normalizedName = nomeCompleto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const uniqueSuffix = randomUUID();

    return `termo-voluntariado-${normalizedName || 'voluntario'}-${dataGeracao}-${uniqueSuffix}.pdf`;
  }
}
