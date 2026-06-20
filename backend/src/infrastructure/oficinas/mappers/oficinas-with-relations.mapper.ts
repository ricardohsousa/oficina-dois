import { PrismaClient } from '@prisma/client';
import type { OficinaResponseDto } from '../../../application/oficinas/dtos/oficina-response.dto';

export async function obterOficinasComRelacoes(
  prisma: PrismaClient
): Promise<OficinaResponseDto[]> {
  const oficinas = await prisma.oficina.findMany({
    include: {
      professores_oficinas: {
        include: {
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
              role: true,
            },
          },
        },
      },
      atuacoes: {
        include: {
          voluntario: {
            select: {
              id: true,
              nomeCompleto: true,
              cpf: true,
              email: true,
              telefone: true,
              ativo: true,
            },
          },
        },
      },
      atividades: {
        include: {
          meses: {
            select: {
              id: true,
              mes: true,
              descricao: true,
            },
            orderBy: {
              mes: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      nome: 'asc',
    },
  });

  return oficinas.map((oficina) => ({
    id: oficina.id,
    nome: oficina.nome,
    descricao: oficina.descricao,
    ano: oficina.ano,
    status: oficina.status as any,
    dataInicio: oficina.dataInicio.toISOString().split('T')[0],
    dataFim: oficina.dataFim?.toISOString().split('T')[0] ?? null,
    professores: oficina.professores_oficinas.map((pof) => ({
      id: pof.professor.id,
      nome: pof.professor.nome,
      email: pof.professor.email,
      role: pof.professor.role,
    })),
    voluntarios: Array.from(
      new Map(
        oficina.atuacoes.map((atuacao) => [
          atuacao.voluntario.id,
          {
            id: atuacao.voluntario.id,
            nomeCompleto: atuacao.voluntario.nomeCompleto,
            cpf: atuacao.voluntario.cpf,
            email: atuacao.voluntario.email,
            telefone: atuacao.voluntario.telefone,
            ativo: atuacao.voluntario.ativo,
          },
        ])
      ).values()
    ),
    atividades: oficina.atividades.map((atividade) => ({
      id: atividade.id,
      nome: atividade.nome,
      descricao: atividade.descricao ?? undefined,
      status: atividade.status,
      meses: atividade.meses.map((mes) => ({
        id: mes.id,
        mes: mes.mes,
        descricao: mes.descricao ?? undefined,
      })),
      createdAt: atividade.createdAt.toISOString(),
      updatedAt: atividade.updatedAt.toISOString(),
    })),
    createdAt: oficina.createdAt.toISOString(),
    updatedAt: oficina.updatedAt.toISOString(),
  }));
}
