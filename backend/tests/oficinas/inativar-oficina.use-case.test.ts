import assert from 'node:assert/strict';
import test from 'node:test';

import { InativarOficinaUseCase } from '../../src/application/oficinas/use-cases/inativar-oficina.use-case';
import { Oficina } from '../../src/domain/oficinas/entities/oficina';
import { HttpError } from '../../src/shared/errors/http-error';

const createOficinaAtiva = () =>
  Oficina.load({
    id: 'ofic-1',
    nome: 'Oficina de Lógica',
    descricao: 'Ensino lúdico',
    status: 'ativa',
    dataInicio: '2026-01-01',
    dataFim: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  });

const createOficinaInativa = () =>
  Oficina.load({
    id: 'ofic-2',
    nome: 'Oficina Encerrada',
    descricao: 'Já inativa',
    status: 'inativa',
    dataInicio: '2025-01-01',
    dataFim: '2025-06-01',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
  });

test('InativarOficinaUseCase inativa oficina ativa e registra auditoria', async () => {
  const updatedOficinas: Array<ReturnType<Oficina['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; entidade: string; entidadeId: string; actor: unknown; dadosAnteriores: unknown; dadosNovos: unknown }> = [];

  const useCase = new InativarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => createOficinaAtiva(),
      update: async (oficina) => {
        updatedOficinas.push(oficina.toJSON());
      },
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async (input) => {
        auditEntries.push({
          acao: input.acao,
          entidade: input.entidade,
          entidadeId: input.entidadeId,
          actor: input.actor,
          dadosAnteriores: input.dadosAnteriores,
          dadosNovos: input.dadosNovos,
        });
      },
    },
  );

  const result = await useCase.execute('ofic-1', {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });

  assert.equal(updatedOficinas.length, 1);
  assert.equal(result.status, 'inativa');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'oficina.inativada');
  assert.equal(auditEntries[0].entidade, 'oficina');
  assert.equal(auditEntries[0].entidadeId, 'ofic-1');
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
  assert.equal((auditEntries[0].dadosAnteriores as Record<string, unknown>).status, 'ativa');
  assert.equal((auditEntries[0].dadosNovos as Record<string, unknown>).status, 'inativa');
});

test('InativarOficinaUseCase lança 409 quando oficina já está inativa', async () => {
  const useCase = new InativarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => createOficinaInativa(),
      update: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('ofic-2'),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});

test('InativarOficinaUseCase lança 404 quando oficina não existe', async () => {
  const useCase = new InativarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => null,
      update: async () => undefined,
    },
    { runInTransaction: async (operation) => operation({ transaction: {} }) },
    { execute: async () => undefined },
  );

  await assert.rejects(
    () => useCase.execute('inexistente'),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    },
  );
});
