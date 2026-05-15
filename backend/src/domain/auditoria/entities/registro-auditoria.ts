import { randomUUID } from 'node:crypto';

export type RegistroAuditoriaAction =
  | 'voluntario.criado'
  | 'voluntario.atualizado'
  | 'voluntario.inativado'
  | 'oficina.criada'
  | 'oficina.atualizada'
  | 'oficina.inativada'
  | 'atuacao.associada'
  | 'termo.gerado';

export type RegistroAuditoriaEntity =
  | 'voluntario'
  | 'oficina'
  | 'atuacao'
  | 'termo_voluntariado';

export type RegistroAuditoriaProps = {
  id: string;
  usuarioId: number | null;
  usuarioNome: string | null;
  usuarioEmail: string | null;
  acao: RegistroAuditoriaAction;
  entidade: RegistroAuditoriaEntity;
  entidadeId: string;
  descricao: string;
  dadosAnteriores: unknown | null;
  dadosNovos: unknown | null;
  createdAt: string;
};

export type CriarRegistroAuditoriaProps = Omit<RegistroAuditoriaProps, 'id' | 'createdAt'>;

export class RegistroAuditoria {
  private constructor(private readonly props: RegistroAuditoriaProps) {}

  static create(input: CriarRegistroAuditoriaProps): RegistroAuditoria {
    return new RegistroAuditoria({
      id: randomUUID(),
      usuarioId: input.usuarioId,
      usuarioNome: input.usuarioNome,
      usuarioEmail: input.usuarioEmail,
      acao: input.acao,
      entidade: input.entidade,
      entidadeId: input.entidadeId,
      descricao: input.descricao.trim(),
      dadosAnteriores: input.dadosAnteriores ?? null,
      dadosNovos: input.dadosNovos ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  static load(props: RegistroAuditoriaProps): RegistroAuditoria {
    return new RegistroAuditoria(props);
  }

  get id(): string {
    return this.props.id;
  }

  get usuarioId(): number | null {
    return this.props.usuarioId;
  }

  get usuarioNome(): string | null {
    return this.props.usuarioNome;
  }

  get usuarioEmail(): string | null {
    return this.props.usuarioEmail;
  }

  get acao(): RegistroAuditoriaAction {
    return this.props.acao;
  }

  get entidade(): RegistroAuditoriaEntity {
    return this.props.entidade;
  }

  get entidadeId(): string {
    return this.props.entidadeId;
  }

  get descricao(): string {
    return this.props.descricao;
  }

  get dadosAnteriores(): unknown | null {
    return this.props.dadosAnteriores;
  }

  get dadosNovos(): unknown | null {
    return this.props.dadosNovos;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toJSON(): RegistroAuditoriaProps {
    return { ...this.props };
  }
}
