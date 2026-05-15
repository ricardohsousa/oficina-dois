import assert from 'node:assert/strict';
import test from 'node:test';

import { RegistroAuditoria } from '../../src/domain/auditoria/entities/registro-auditoria';
import { ListarRegistrosAuditoriaUseCase } from '../../src/application/auditoria/use-cases/listar-registros-auditoria.use-case';

test('ListarRegistrosAuditoriaUseCase retorna registros mapeados e repassa filtros', async () => {
  let receivedFilters: unknown;

  const registro = RegistroAuditoria.load({
    id: 'aud-1',
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
    acao: 'voluntario.criado',
    entidade: 'voluntario',
    entidadeId: 'vol-1',
    descricao: 'Voluntário cadastrado.',
    dadosAnteriores: null,
    dadosNovos: { nomeCompleto: 'Maria Silva' },
    createdAt: '2026-05-14T10:00:00.000Z',
  });

  const useCase = new ListarRegistrosAuditoriaUseCase({
    create: async () => undefined,
    findMany: async (filters) => {
      receivedFilters = filters;
      return [registro];
    },
  });

  const result = await useCase.execute({ entidade: 'voluntario' });

  assert.deepEqual(receivedFilters, { entidade: 'voluntario' });
  assert.deepEqual(result, [
    {
      id: 'aud-1',
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
      acao: 'voluntario.criado',
      entidade: 'voluntario',
      entidadeId: 'vol-1',
      descricao: 'Voluntário cadastrado.',
      dadosAnteriores: null,
      dadosNovos: { nomeCompleto: 'Maria Silva' },
      createdAt: '2026-05-14T10:00:00.000Z',
    },
  ]);
});
