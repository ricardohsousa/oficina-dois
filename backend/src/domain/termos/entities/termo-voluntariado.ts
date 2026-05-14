import { randomUUID } from 'node:crypto';

export type CriarTermoVoluntariadoProps = {
  voluntarioId: string;
  nomeArquivo: string;
  caminhoArquivo: string;
  mimeType?: string;
};

export type TermoVoluntariadoProps = {
  id: string;
  voluntarioId: string;
  nomeArquivo: string;
  caminhoArquivo: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
};

export class TermoVoluntariado {
  private constructor(private readonly props: TermoVoluntariadoProps) {}

  static create(input: CriarTermoVoluntariadoProps): TermoVoluntariado {
    const now = new Date().toISOString();

    return new TermoVoluntariado({
      id: randomUUID(),
      voluntarioId: input.voluntarioId,
      nomeArquivo: input.nomeArquivo,
      caminhoArquivo: input.caminhoArquivo,
      mimeType: input.mimeType ?? 'application/pdf',
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: TermoVoluntariadoProps): TermoVoluntariado {
    return new TermoVoluntariado(props);
  }

  get id(): string {
    return this.props.id;
  }

  get voluntarioId(): string {
    return this.props.voluntarioId;
  }

  get nomeArquivo(): string {
    return this.props.nomeArquivo;
  }

  get caminhoArquivo(): string {
    return this.props.caminhoArquivo;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  toJSON(): TermoVoluntariadoProps {
    return { ...this.props };
  }
}
