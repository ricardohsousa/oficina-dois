import { PrismaClient } from '@prisma/client';
import { Voluntario } from '../../../domain/voluntarios/entities/voluntario';
import { VoluntarioRepository } from '../../../domain/voluntarios/repositories/voluntario.repository';

export class PrismaVoluntarioRepository implements VoluntarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async findByCpf(cpf: string): Promise<Voluntario | null> {
    const data = await this.prisma.voluntario.findUnique({
      where: { cpf },
    });

    if (!data) {
      return null;
    }

    return Voluntario.load({
      ...data,
      dataNascimento: data.dataNascimento.toISOString().split('T')[0],
      dataEntrada: data.dataEntrada.toISOString().split('T')[0],
      dataSaida: data.dataSaida?.toISOString().split('T')[0] ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }

  async findByEmail(email: string): Promise<Voluntario | null> {
    const data = await this.prisma.voluntario.findUnique({
      where: { email },
    });

    if (!data) {
      return null;
    }

    return Voluntario.load({
      ...data,
      dataNascimento: data.dataNascimento.toISOString().split('T')[0],
      dataEntrada: data.dataEntrada.toISOString().split('T')[0],
      dataSaida: data.dataSaida?.toISOString().split('T')[0] ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    });
  }
}

