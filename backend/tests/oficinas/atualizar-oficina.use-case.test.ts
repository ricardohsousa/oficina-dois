import assert from 'node:assert/strict';
import test from 'node:test';

import { AtualizarOficinaUseCase } from '../../src/application/oficinas/use-cases/atualizar-oficina.use-case';
import { Oficina } from '../../src/domain/oficinas/entities/oficina';
import { HttpError } from '../../src/shared/errors/http-error';

const createOficinaExistente = () =>
  Oficina.load({
    id: 'ofic-1',
    nome: 'Oficina Antiga',
    descricao: 'Descrição antiga',
    status: 'ativa',
    dataInicio: '2026-01-01',
    dataFim: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  });

test('AtualizarOficinaUseCase atualiza oficina e registra auditoria com snapshots', async () => {
  const updatedOficinas: Array<ReturnType<Oficina['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; dadosAnteriores: unknown; dadosNovos: unknown; actor: unknown }> = [];

  const useCase = new AtualizarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => createOficinaExistente(),
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
          dadosAnteriores: input.dadosAnteriores,
          dadosNovos: input.dadosNovos,
          actor: input.actor,
        });
      },
    },
  );

  const result = await useCase.execute(
    'ofic-1',
    {
      nome: 'Oficina Atualizada',
      descricao: 'Nova descrição',
      dataInicio: '2026-02-01',
    },
    {
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
    },
  );

  assert.equal(updatedOficinas.length, 1);
  assert.equal(result.nome, 'Oficina Atualizada');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'oficina.atualizada');
  assert.ok(auditEntries[0].dadosAnteriores !== null, 'dadosAnteriores deve ser preenchido');
  assert.ok(auditEntries[0].dadosNovos !== null, 'dadosNovos deve ser preenchido');
  assert.equal((auditEntries[0].dadosAnteriores as ReturnType<Oficina['toJSON']>).nome, 'Oficina Antiga');
  assert.equal((auditEntries[0].dadosNovos as ReturnType<Oficina['toJSON']>).nome, 'Oficina Atualizada');
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
});

test('AtualizarOficinaUseCase preserva dataFim quando fornecida', async () => {
  const useCase = new AtualizarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => createOficinaExistente(),
      update: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  const result = await useCase.execute('ofic-1', {
    nome: 'Oficina Atualizada',
    descricao: 'Nova descrição',
    dataInicio: '2026-02-01',
    dataFim: '2026-06-30',
  });

  assert.equal(result.dataFim, '2026-06-30');
});

test('AtualizarOficinaUseCase lança 404 quando oficina não existe', async () => {
  const useCase = new AtualizarOficinaUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => null,
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
    () =>
      useCase.execute('inexistente', {
        nome: 'Qualquer',
        descricao: 'Qualquer',
        dataInicio: '2026-01-01',
      }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    },
  );
});
