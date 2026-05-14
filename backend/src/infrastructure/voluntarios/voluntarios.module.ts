import { AtualizarVoluntarioUseCase } from '../../application/voluntarios/use-cases/atualizar-voluntario.use-case';
import { TokenService } from '../../application/auth/services/token-service';
import { BuscarVoluntarioPorIdUseCase } from '../../application/voluntarios/use-cases/buscar-voluntario-por-id.use-case';
import { CriarVoluntarioUseCase } from '../../application/voluntarios/use-cases/criar-voluntario.use-case';
import { InativarVoluntarioUseCase } from '../../application/voluntarios/use-cases/inativar-voluntario.use-case';
import { ListarVoluntariosUseCase } from '../../application/voluntarios/use-cases/listar-voluntarios.use-case';
import { VoluntariosController } from '../../interfaces/http/controllers/voluntarios.controller';
import { createVoluntariosRoutes } from '../../interfaces/http/routes/voluntarios.routes';
import { prismaClient } from '../database/prisma/client';
import { PrismaAtuacaoRepository } from '../atuacoes/repositories/prisma-atuacao.repository';
import { PrismaVoluntarioRepository } from './repositories/prisma-voluntario.repository';

export const createVoluntariosModule = (tokenService: TokenService) => {
  const voluntarioRepository = new PrismaVoluntarioRepository(prismaClient);
  const atuacaoRepository = new PrismaAtuacaoRepository(prismaClient);

  const criarVoluntarioUseCase = new CriarVoluntarioUseCase(voluntarioRepository);
  const atualizarVoluntarioUseCase = new AtualizarVoluntarioUseCase(voluntarioRepository);
  const inativarVoluntarioUseCase = new InativarVoluntarioUseCase(
    voluntarioRepository,
    atuacaoRepository,
  );
  const listarVoluntariosUseCase = new ListarVoluntariosUseCase(voluntarioRepository);
  const buscarVoluntarioPorIdUseCase = new BuscarVoluntarioPorIdUseCase(voluntarioRepository);

  const voluntariosController = new VoluntariosController(
    criarVoluntarioUseCase,
    atualizarVoluntarioUseCase,
    inativarVoluntarioUseCase,
    listarVoluntariosUseCase,
    buscarVoluntarioPorIdUseCase,
  );

  return createVoluntariosRoutes(voluntariosController, tokenService);
};
