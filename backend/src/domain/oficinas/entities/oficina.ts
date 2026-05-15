import { randomUUID } from 'node:crypto';

import { ValidationError } from '../../../shared/errors/validation-error';

export type OficinaStatus = 'ativa' | 'inativa';

export type CriarOficinaProps = {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string | null;
};

export type OficinaProps = {
  id: string;
  nome: string;
  descricao: string;
  status: OficinaStatus;
  dataInicio: string;
  dataFim: string | null;
  createdAt: string;
  updatedAt: string;
};

export class Oficina {
  private constructor(private props: OficinaProps) {}

  static create(input: CriarOficinaProps): Oficina {
    const now = new Date().toISOString();

    return new Oficina({
      id: randomUUID(),
      nome: Oficina.requireText(input.nome, 'nome'),
      descricao: Oficina.requireText(input.descricao, 'descricao'),
      status: 'ativa',
      dataInicio: Oficina.requireText(input.dataInicio, 'dataInicio'),
      dataFim: input.dataFim ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: OficinaProps): Oficina {
    return new Oficina(props);
  }

  get id(): string { return this.props.id; }
  get nome(): string { return this.props.nome; }
  get descricao(): string { return this.props.descricao; }
  get status(): OficinaStatus { return this.props.status; }
  get dataInicio(): string { return this.props.dataInicio; }
  get dataFim(): string | null { return this.props.dataFim; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  get ativa(): boolean {
    return this.props.status === 'ativa';
  }

  toJSON(): OficinaProps {
    return { ...this.props };
  }

  private static requireText(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new ValidationError('Um ou mais campos enviados são inválidos.', [
        { field, message: 'Campo obrigatório.' },
      ]);
    }

    return normalized;
  }
}
