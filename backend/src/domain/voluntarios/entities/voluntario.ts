import { randomUUID } from 'node:crypto';

import { ValidationError } from '../../../shared/errors/validation-error';

export type CriarVoluntarioProps = {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
};

export type VoluntarioProps = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  dataEntrada: string;
  dataSaida: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

export class Voluntario {
  private constructor(private props: VoluntarioProps) {}

  static create(input: CriarVoluntarioProps): Voluntario {
    const now = new Date().toISOString();

    return new Voluntario({
      id: randomUUID(),
      nomeCompleto: Voluntario.requireText(input.nomeCompleto, 'nomeCompleto'),
      cpf: Voluntario.requireCpf(input.cpf),
      dataNascimento: Voluntario.requireText(input.dataNascimento, 'dataNascimento'),
      email: Voluntario.requireEmail(input.email),
      telefone: Voluntario.requireText(input.telefone, 'telefone'),
      endereco: Voluntario.requireText(input.endereco, 'endereco'),
      dataEntrada: Voluntario.requireText(input.dataEntrada, 'dataEntrada'),
      dataSaida: null,
      ativo: true,
      createdAt: now,
      updatedAt: now
    });
  }

  static load(props: VoluntarioProps): Voluntario {
    return new Voluntario(props);
  }

  static normalizeCpf(value: string): string {
    return value.replace(/\D/g, '');
  }

  static normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  get id(): string {
    return this.props.id;
  }

  get nomeCompleto(): string {
    return this.props.nomeCompleto;
  }

  get cpf(): string {
    return this.props.cpf;
  }

  get dataNascimento(): string {
    return this.props.dataNascimento;
  }

  get email(): string {
    return this.props.email;
  }

  get telefone(): string {
    return this.props.telefone;
  }

  get endereco(): string {
    return this.props.endereco;
  }

  get dataEntrada(): string {
    return this.props.dataEntrada;
  }

  get dataSaida(): string | null {
    return this.props.dataSaida;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  toJSON(): VoluntarioProps {
    return { ...this.props };
  }

  private static requireText(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new ValidationError('Um ou mais campos enviados são inválidos.', [
        { field, message: 'Campo obrigatório.' }
      ]);
    }

    return normalized;
  }

  private static requireCpf(value: string): string {
    const normalized = Voluntario.normalizeCpf(value);

    if (!normalized) {
      throw new ValidationError('Um ou mais campos enviados são inválidos.', [
        { field: 'cpf', message: 'Campo obrigatório.' }
      ]);
    }

    return normalized;
  }

  private static requireEmail(value: string): string {
    const normalized = Voluntario.normalizeEmail(value);

    if (!normalized) {
      throw new ValidationError('Um ou mais campos enviados são inválidos.', [
        { field: 'email', message: 'Campo obrigatório.' }
      ]);
    }

    return normalized;
  }
}
