import type { TokenService } from '../../application/auth/services/token-service';
import { AssociarVoluntarioOficinaUseCase } from '../../application/atuacoes/use-cases/associar-voluntario-oficina.use-case';
import { ListarAtuacoesDoVoluntarioUseCase } from '../../application/atuacoes/use-cases/listar-atuacoes-do-voluntario.use-case';
import { prismaClient } from '../database/prisma/client';
import { PrismaAtuacaoRepository } from './repositories/prisma-atuacao.repository';
import { PrismaOficinaRepository } from '../oficinas/repositories/prisma-oficina.repository';
import { PrismaVoluntarioRepository } from '../voluntarios/repositories/prisma-voluntario.repository';
import { AtuacoesController } from '../../interfaces/http/controllers/atuacoes.controller';
import { createAtuacoesRoutes } from '../../interfaces/http/routes/atuacoes.routes';

export const createAtuacoesModule = (tokenService: TokenService) => {
  const atuacaoRepository = new PrismaAtuacaoRepository(prismaClient);
  const voluntarioRepository = new PrismaVoluntarioRepository(prismaClient);
  const oficinaRepository = new PrismaOficinaRepository(prismaClient);

  const associarVoluntarioOficinaUseCase = new AssociarVoluntarioOficinaUseCase(
    atuacaoRepository,
    voluntarioRepository,
    oficinaRepository,
  );

  const listarAtuacoesDoVoluntarioUseCase = new ListarAtuacoesDoVoluntarioUseCase(
    atuacaoRepository,
    voluntarioRepository,
  );

  const atuacoesController = new AtuacoesController(
    associarVoluntarioOficinaUseCase,
    listarAtuacoesDoVoluntarioUseCase,
  );

  return createAtuacoesRoutes(atuacoesController, tokenService);
};
