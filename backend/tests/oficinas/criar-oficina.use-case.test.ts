import assert from 'node:assert/strict';
import test from 'node:test';

import { CriarOficinaUseCase } from '../../src/application/oficinas/use-cases/criar-oficina.use-case';
import { Oficina } from '../../src/domain/oficinas/entities/oficina';

test('CriarOficinaUseCase cria oficina e registra auditoria com autor autenticado', async () => {
  const createdOficinas: Array<ReturnType<Oficina['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; entidade: string; entidadeId: string; dadosAnteriores: unknown; dadosNovos: unknown; actor: unknown }> = [];

  const useCase = new CriarOficinaUseCase(
    {
      create: async (oficina) => {
        createdOficinas.push(oficina.toJSON());
      },
      findAll: async () => [],
      findById: async () => null,
      update: async () => undefined,
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
          dadosAnteriores: input.dadosAnteriores,
          dadosNovos: input.dadosNovos,
          actor: input.actor,
        });
      },
    },
  );

  const result = await useCase.execute(
    {
      nome: 'Oficina de Lógica',
      descricao: 'Ensino lúdico de lógica e programação',
      dataInicio: '2026-03-01',
    },
    {
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
    },
  );

  assert.equal(createdOficinas.length, 1);
  assert.equal(result.nome, 'Oficina de Lógica');
  assert.equal(result.status, 'ativa');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'oficina.criada');
  assert.equal(auditEntries[0].entidade, 'oficina');
  assert.equal(auditEntries[0].entidadeId, result.id);
  assert.equal(auditEntries[0].dadosAnteriores, null);
  assert.ok(auditEntries[0].dadosNovos !== null, 'dadosNovos deve ser preenchido na criação');
  assert.equal((auditEntries[0].dadosNovos as ReturnType<Oficina['toJSON']>).nome, 'Oficina de Lógica');
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
});

test('CriarOficinaUseCase cria oficina sem actor autenticado', async () => {
  const useCase = new CriarOficinaUseCase(
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

  const result = await useCase.execute({
    nome: 'Oficina de Robótica',
    descricao: 'Ensino de robótica',
    dataInicio: '2026-04-01',
  });

  assert.equal(result.nome, 'Oficina de Robótica');
  assert.equal(result.status, 'ativa');
});
