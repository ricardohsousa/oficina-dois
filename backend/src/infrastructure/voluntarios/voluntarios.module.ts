import { AtualizarVoluntarioUseCase } from '../../application/voluntarios/use-cases/atualizar-voluntario.use-case';
import { CriarVoluntarioUseCase } from '../../application/voluntarios/use-cases/criar-voluntario.use-case';
import { InativarVoluntarioUseCase } from '../../application/voluntarios/use-cases/inativar-voluntario.use-case';
import { ListarVoluntariosUseCase } from '../../application/voluntarios/use-cases/listar-voluntarios.use-case';
import { ObterVoluntarioUseCase } from '../../application/voluntarios/use-cases/obter-voluntario.use-case';
import { InMemoryVoluntarioRepository } from './repositories/in-memory-voluntario.repository';
import { VoluntariosController } from '../../interfaces/http/controllers/voluntarios.controller';
import { createVoluntariosRoutes } from '../../interfaces/http/routes/voluntarios.routes';

export const createVoluntariosModule = () => {
  const voluntarioRepository = new InMemoryVoluntarioRepository();

  const criarVoluntarioUseCase = new CriarVoluntarioUseCase(voluntarioRepository);
  const listarVoluntariosUseCase = new ListarVoluntariosUseCase(voluntarioRepository);
  const obterVoluntarioUseCase = new ObterVoluntarioUseCase(voluntarioRepository);
  const atualizarVoluntarioUseCase = new AtualizarVoluntarioUseCase(voluntarioRepository);
  const inativarVoluntarioUseCase = new InativarVoluntarioUseCase(voluntarioRepository);

  const voluntariosController = new VoluntariosController(
    criarVoluntarioUseCase,
    listarVoluntariosUseCase,
    obterVoluntarioUseCase,
    atualizarVoluntarioUseCase,
    inativarVoluntarioUseCase
  );

  return createVoluntariosRoutes(voluntariosController);
};
