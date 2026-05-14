import { PrismaClient } from '@prisma/client';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';

export class PrismaVoluntarioRepository implements VoluntarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(data: {
    id: string;
    nomeCompleto: string;
    cpf: string;
    dataNascimento: Date;
    email: string;
    telefone: string;
    endereco: string;
    dataEntrada: Date;
    dataSaida: Date | null;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Voluntario {
    return Voluntario.load({
      ...data,
      dataNascimento: data.dataNascimento.toISOString().split('T')[0],
      dataEntrada: data.dataEntrada.toISOString().split('T')[0],
      dataSaida: data.dataSaida?.toISOString().split('T')[0] ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }

  async create(voluntario: Voluntario): Promise<void> {
    await this.prisma.voluntario.create({
      data: {
        ...voluntario.toJSON(),
        dataNascimento: new Date(voluntario.dataNascimento),
        dataEntrada: new Date(voluntario.dataEntrada),
        dataSaida: voluntario.dataSaida ? new Date(voluntario.dataSaida) : null,
      }
    });
  }

  async update(voluntario: Voluntario): Promise<void> {
    await this.prisma.voluntario.update({
      where: {
        id: voluntario.id,
      },
      data: {
        nomeCompleto: voluntario.nomeCompleto,
        cpf: voluntario.cpf,
        dataNascimento: new Date(voluntario.dataNascimento),
        email: voluntario.email,
        telefone: voluntario.telefone,
        endereco: voluntario.endereco,
        dataEntrada: new Date(voluntario.dataEntrada),
        dataSaida: voluntario.dataSaida ? new Date(voluntario.dataSaida) : null,
        ativo: voluntario.ativo,
        updatedAt: new Date(voluntario.updatedAt),
      },
    });
  }

  async findAll(): Promise<Voluntario[]> {
    const data = await this.prisma.voluntario.findMany({
      orderBy: {
        nomeCompleto: 'asc',
      },
    });

    return data.map((item) => this.mapToDomain(item));
  }

  async findById(id: string): Promise<Voluntario | null> {
    const data = await this.prisma.voluntario.findUnique({
      where: { id },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }

  async findByCpf(cpf: string): Promise<Voluntario | null> {
    const data = await this.prisma.voluntario.findUnique({
      where: { cpf },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }

  async findByEmail(email: string): Promise<Voluntario | null> {
    const data = await this.prisma.voluntario.findUnique({
      where: { email },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }
}

