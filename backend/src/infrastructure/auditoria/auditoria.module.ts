import type { TokenService } from '../../application/auth/services/token-service';
import { ListarRegistrosAuditoriaUseCase } from '../../application/auditoria/use-cases/listar-registros-auditoria.use-case';
import { AuditoriaController } from '../../interfaces/http/controllers/auditoria.controller';
import { createAuditoriaRoutes } from '../../interfaces/http/routes/auditoria.routes';
import { prismaClient } from '../database/prisma/client';
import { PrismaRegistroAuditoriaRepository } from './repositories/prisma-registro-auditoria.repository';

export const createAuditoriaModule = (tokenService: TokenService) => {
  const registroAuditoriaRepository = new PrismaRegistroAuditoriaRepository(prismaClient);
  const listarRegistrosAuditoriaUseCase = new ListarRegistrosAuditoriaUseCase(
    registroAuditoriaRepository,
  );

  const auditoriaController = new AuditoriaController(listarRegistrosAuditoriaUseCase);

  return createAuditoriaRoutes(auditoriaController, tokenService);
};
