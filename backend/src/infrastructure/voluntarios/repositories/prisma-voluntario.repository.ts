import { PrismaClient } from '@prisma/client';
import { FiltrarVoluntariosDto } from '../../../application/voluntarios/dtos/filtrar-voluntarios.dto';
import { TransactionContext } from '../../../shared/database/transaction-manager';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';
import { resolvePrismaClient } from '../../database/prisma/transaction-context';

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

  async create(voluntario: Voluntario, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prisma, context);

    await prisma.voluntario.create({
      data: {
        ...voluntario.toJSON(),
        dataNascimento: new Date(voluntario.dataNascimento),
        dataEntrada: new Date(voluntario.dataEntrada),
        dataSaida: voluntario.dataSaida ? new Date(voluntario.dataSaida) : null,
      }
    });
  }

  async update(voluntario: Voluntario, context?: TransactionContext): Promise<void> {
    const prisma = resolvePrismaClient(this.prisma, context);

    await prisma.voluntario.update({
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
      orderBy: { nomeCompleto: 'asc' },
    });

    return data.map((item) => this.mapToDomain(item));
  }

  async findWithFilters(filters: FiltrarVoluntariosDto): Promise<Voluntario[]> {
    const data = await this.prisma.voluntario.findMany({
      where: {
        ...(filters.nome && {
          nomeCompleto: { contains: filters.nome, mode: 'insensitive' },
        }),
        ...(filters.cpf && { cpf: filters.cpf }),
        ...(filters.email && {
          email: { contains: filters.email, mode: 'insensitive' },
        }),
        ...(filters.ativo !== undefined && { ativo: filters.ativo }),
      },
      orderBy: { nomeCompleto: 'asc' },
    });

    return data.map((item) => this.mapToDomain(item));
  }

  async findById(id: string, context?: TransactionContext): Promise<Voluntario | null> {
    const prisma = resolvePrismaClient(this.prisma, context);
    const data = await prisma.voluntario.findUnique({
      where: { id },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }

  async findByCpf(cpf: string, context?: TransactionContext): Promise<Voluntario | null> {
    const prisma = resolvePrismaClient(this.prisma, context);
    const data = await prisma.voluntario.findUnique({
      where: { cpf },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }

  async findByEmail(email: string, context?: TransactionContext): Promise<Voluntario | null> {
    const prisma = resolvePrismaClient(this.prisma, context);
    const data = await prisma.voluntario.findUnique({
      where: { email },
    });

    if (!data) {
      return null;
    }

    return this.mapToDomain(data);
  }
}
