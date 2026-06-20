import { RegistrarAuditoriaService } from '../../application/auditoria/use-cases/registrar-auditoria.service';
import type { TokenService } from '../../application/auth/services/token-service';
import { AssociarVoluntarioOficinaUseCase } from '../../application/atuacoes/use-cases/associar-voluntario-oficina.use-case';
import { ListarHistoricoDoVoluntarioUseCase } from '../../application/atuacoes/use-cases/listar-historico-do-voluntario.use-case';
import { ListarAtuacoesDoVoluntarioUseCase } from '../../application/atuacoes/use-cases/listar-atuacoes-do-voluntario.use-case';
import { prismaClient } from '../database/prisma/client';
import { PrismaTransactionManager } from '../database/prisma/transaction-context';
import { PrismaRegistroAuditoriaRepository } from '../auditoria/repositories/prisma-registro-auditoria.repository';
import { PrismaAtuacaoRepository } from './repositories/prisma-atuacao.repository';
import { PrismaOficinaRepository } from '../oficinas/repositories/prisma-oficina.repository';
import { PrismaProfessorOficinaRepository } from '../oficinas/repositories/prisma-professor-oficina.repository';
import { PrismaVoluntarioRepository } from '../voluntarios/repositories/prisma-voluntario.repository';
import { AtuacoesController } from '../../interfaces/http/controllers/atuacoes.controller';
import { createAtuacoesRoutes } from '../../interfaces/http/routes/atuacoes.routes';

export const createAtuacoesModule = (tokenService: TokenService) => {
  const atuacaoRepository = new PrismaAtuacaoRepository(prismaClient);
  const voluntarioRepository = new PrismaVoluntarioRepository(prismaClient);
  const oficinaRepository = new PrismaOficinaRepository(prismaClient);
  const professorOficinaRepository = new PrismaProfessorOficinaRepository(prismaClient);
  const transactionManager = new PrismaTransactionManager(prismaClient);
  const registroAuditoriaRepository = new PrismaRegistroAuditoriaRepository(prismaClient);
  const registrarAuditoriaService = new RegistrarAuditoriaService(registroAuditoriaRepository);

  const associarVoluntarioOficinaUseCase = new AssociarVoluntarioOficinaUseCase(
    atuacaoRepository,
    voluntarioRepository,
    oficinaRepository,
    professorOficinaRepository,
    transactionManager,
    registrarAuditoriaService,
  );

  const listarAtuacoesDoVoluntarioUseCase = new ListarAtuacoesDoVoluntarioUseCase(
    atuacaoRepository,
    voluntarioRepository,
  );
  const listarHistoricoDoVoluntarioUseCase = new ListarHistoricoDoVoluntarioUseCase(
    atuacaoRepository,
    voluntarioRepository,
  );

  const atuacoesController = new AtuacoesController(
    associarVoluntarioOficinaUseCase,
    listarAtuacoesDoVoluntarioUseCase,
    listarHistoricoDoVoluntarioUseCase,
  );

  return createAtuacoesRoutes(atuacoesController, tokenService);
};
