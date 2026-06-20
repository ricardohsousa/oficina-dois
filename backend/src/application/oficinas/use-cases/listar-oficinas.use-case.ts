import { PrismaClient } from '@prisma/client';
import type { OficinaRepository } from '../../../domain/oficinas/repositories/oficina.repository';
import type { OficinaResponseDto } from '../dtos/oficina-response.dto';
import { toOficinaResponseDto } from './oficina-presenter';
import { obterOficinasComRelacoes } from '../../../infrastructure/oficinas/mappers/oficinas-with-relations.mapper';

export class ListarOficinasUseCase {
  constructor(
    private readonly oficinaRepository: OficinaRepository,
    private readonly prisma?: PrismaClient,
  ) {}

  async execute(): Promise<OficinaResponseDto[]> {
    if (this.prisma) {
      return obterOficinasComRelacoes(this.prisma);
    }

    const oficinas = await this.oficinaRepository.findAll();
    return oficinas.map(toOficinaResponseDto);
  }
}
