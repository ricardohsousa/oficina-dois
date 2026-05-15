import { RegistrarAuditoriaService } from '../../application/auditoria/use-cases/registrar-auditoria.service';
import type { TokenService } from '../../application/auth/services/token-service';
import { AtualizarOficinaUseCase } from '../../application/oficinas/use-cases/atualizar-oficina.use-case';
import { BuscarOficinaPorIdUseCase } from '../../application/oficinas/use-cases/buscar-oficina-por-id.use-case';
import { CriarOficinaUseCase } from '../../application/oficinas/use-cases/criar-oficina.use-case';
import { InativarOficinaUseCase } from '../../application/oficinas/use-cases/inativar-oficina.use-case';
import { ListarOficinasUseCase } from '../../application/oficinas/use-cases/listar-oficinas.use-case';
import { prismaClient } from '../database/prisma/client';
import { PrismaTransactionManager } from '../database/prisma/transaction-context';
import { PrismaRegistroAuditoriaRepository } from '../auditoria/repositories/prisma-registro-auditoria.repository';
import { OficinasController } from '../../interfaces/http/controllers/oficinas.controller';
import { createOficinasRoutes } from '../../interfaces/http/routes/oficinas.routes';
import { PrismaOficinaRepository } from './repositories/prisma-oficina.repository';

export const createOficinasModule = (tokenService: TokenService) => {
  const oficinaRepository = new PrismaOficinaRepository(prismaClient);
  const transactionManager = new PrismaTransactionManager(prismaClient);
  const registroAuditoriaRepository = new PrismaRegistroAuditoriaRepository(prismaClient);
  const registrarAuditoriaService = new RegistrarAuditoriaService(registroAuditoriaRepository);

  const criarOficinaUseCase = new CriarOficinaUseCase(
    oficinaRepository,
    transactionManager,
    registrarAuditoriaService,
  );
  const atualizarOficinaUseCase = new AtualizarOficinaUseCase(
    oficinaRepository,
    transactionManager,
    registrarAuditoriaService,
  );
  const listarOficinasUseCase = new ListarOficinasUseCase(oficinaRepository);
  const buscarOficinaPorIdUseCase = new BuscarOficinaPorIdUseCase(oficinaRepository);
  const inativarOficinaUseCase = new InativarOficinaUseCase(
    oficinaRepository,
    transactionManager,
    registrarAuditoriaService,
  );

  const oficinasController = new OficinasController(
    criarOficinaUseCase,
    atualizarOficinaUseCase,
    listarOficinasUseCase,
    buscarOficinaPorIdUseCase,
    inativarOficinaUseCase,
  );

  return createOficinasRoutes(oficinasController, tokenService);
};
