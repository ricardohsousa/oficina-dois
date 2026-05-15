import assert from 'node:assert/strict';
import test from 'node:test';

import { InativarVoluntarioUseCase } from '../../src/application/voluntarios/use-cases/inativar-voluntario.use-case';
import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { HttpError } from '../../src/shared/errors/http-error';

const createVoluntario = () =>
  Voluntario.load({
    id: 'vol-1',
    nomeCompleto: 'Maria Silva',
    cpf: '12345678900',
    dataNascimento: '1995-06-15',
    email: 'maria@example.com',
    telefone: '41999990000',
    endereco: 'Rua A, 123',
    dataEntrada: '2026-01-10',
    dataSaida: null,
    ativo: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  });

test('InativarVoluntarioUseCase inativa, reconcilia atuações e registra auditoria', async () => {
  const reconciled: Array<{ id: string; dataSaida: string }> = [];
  const updatedVoluntarios: Array<ReturnType<Voluntario['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; descricao: string; actor: unknown }> = [];

  const useCase = new InativarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async (voluntario) => {
        updatedVoluntarios.push(voluntario.toJSON());
      },
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async (id, dataSaida) => {
        reconciled.push({ id, dataSaida });
      },
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async (input) => {
        auditEntries.push({
          acao: input.acao,
          descricao: input.descricao,
          actor: input.actor,
        });
      },
    },
  );

  const result = await useCase.execute('vol-1', {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });

  assert.equal(reconciled.length, 1);
  assert.equal(reconciled[0].id, 'vol-1');
  assert.match(reconciled[0].dataSaida, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(updatedVoluntarios.length, 1);
  assert.equal(result.ativo, false);
  assert.equal(result.dataSaida, reconciled[0].dataSaida);
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'voluntario.inativado');
  assert.match(auditEntries[0].descricao, /desligamento/i);
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
});

const createVoluntarioInativo = () =>
  Voluntario.load({
    id: 'vol-2',
    nomeCompleto: 'Maria Silva',
    cpf: '12345678900',
    dataNascimento: '1995-06-15',
    email: 'maria@example.com',
    telefone: '41999990000',
    endereco: 'Rua A, 123',
    dataEntrada: '2026-01-10',
    dataSaida: '2026-03-01',
    ativo: false,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  });

const makeAtuacaoRepositoryStub = () => ({
  create: async () => undefined,
  findByVoluntario: async () => [],
  findHistoricoByVoluntario: async () => [],
  findByVoluntarioAndOficina: async () => null,
  reconcileForVoluntarioInactivation: async () => undefined,
});

test('InativarVoluntarioUseCase inativa voluntário sem actor autenticado', async () => {
  const useCase = new InativarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    makeAtuacaoRepositoryStub(),
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  const result = await useCase.execute('vol-1');

  assert.equal(result.ativo, false);
});

test('InativarVoluntarioUseCase lança 404 quando voluntário não existe', async () => {
  const useCase = new InativarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => null,
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    makeAtuacaoRepositoryStub(),
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
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

test('InativarVoluntarioUseCase lança 409 quando voluntário já está inativo', async () => {
  const useCase = new InativarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioInativo(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    makeAtuacaoRepositoryStub(),
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('vol-2'),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});
