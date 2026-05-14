import type { TokenService } from '../../application/auth/services/token-service';
import { DownloadTermoVoluntariadoUseCase } from '../../application/termos/use-cases/download-termo-voluntariado.use-case';
import { GerarTermoVoluntariadoUseCase } from '../../application/termos/use-cases/gerar-termo-voluntariado.use-case';
import { prismaClient } from '../database/prisma/client';
import { PuppeteerTermoPdfGenerator } from '../pdf/puppeteer-termo-pdf-generator';
import { PrismaAtuacaoRepository } from '../atuacoes/repositories/prisma-atuacao.repository';
import { PrismaTermoVoluntariadoRepository } from './repositories/prisma-termo-voluntariado.repository';
import { LocalTermoFileStorage } from './storage/local-termo-file-storage';
import { PrismaVoluntarioRepository } from '../voluntarios/repositories/prisma-voluntario.repository';
import { TermosController } from '../../interfaces/http/controllers/termos.controller';
import { createTermosRoutes } from '../../interfaces/http/routes/termos.routes';

export const createTermosModule = (tokenService: TokenService) => {
  const voluntarioRepository = new PrismaVoluntarioRepository(prismaClient);
  const atuacaoRepository = new PrismaAtuacaoRepository(prismaClient);
  const termoRepository = new PrismaTermoVoluntariadoRepository(prismaClient);
  const termoPdfGenerator = new PuppeteerTermoPdfGenerator();
  const termoFileStorage = new LocalTermoFileStorage();

  const gerarTermoVoluntariadoUseCase = new GerarTermoVoluntariadoUseCase(
    voluntarioRepository,
    atuacaoRepository,
    termoRepository,
    termoPdfGenerator,
    termoFileStorage,
  );
  const downloadTermoVoluntariadoUseCase = new DownloadTermoVoluntariadoUseCase(
    termoRepository,
    termoFileStorage,
  );

  const termosController = new TermosController(
    gerarTermoVoluntariadoUseCase,
    downloadTermoVoluntariadoUseCase,
  );

  return createTermosRoutes(termosController, tokenService);
};
