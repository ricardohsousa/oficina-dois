import { randomUUID } from 'node:crypto';

export type CriarAtuacaoProps = {
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim?: string | null;
  cargaHoraria?: number | null;
};

export type AtuacaoProps = {
  id: string;
  voluntarioId: string;
  oficinaId: string;
  dataInicio: string;
  dataFim: string | null;
  cargaHoraria: number | null;
  createdAt: string;
  updatedAt: string;
};

export class Atuacao {
  private constructor(private props: AtuacaoProps) {}

  static create(input: CriarAtuacaoProps): Atuacao {
    const now = new Date().toISOString();

    return new Atuacao({
      id: randomUUID(),
      voluntarioId: input.voluntarioId,
      oficinaId: input.oficinaId,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim ?? null,
      cargaHoraria: input.cargaHoraria ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: AtuacaoProps): Atuacao {
    return new Atuacao(props);
  }

  get id(): string { return this.props.id; }
  get voluntarioId(): string { return this.props.voluntarioId; }
  get oficinaId(): string { return this.props.oficinaId; }
  get dataInicio(): string { return this.props.dataInicio; }
  get dataFim(): string | null { return this.props.dataFim; }
  get cargaHoraria(): number | null { return this.props.cargaHoraria; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  toJSON(): AtuacaoProps {
    return { ...this.props };
  }
}
