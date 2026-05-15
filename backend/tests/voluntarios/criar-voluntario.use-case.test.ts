import assert from 'node:assert/strict';
import test from 'node:test';

import { CriarVoluntarioUseCase } from '../../src/application/voluntarios/use-cases/criar-voluntario.use-case';
import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { ConflictError } from '../../src/shared/errors/conflict-error';

test('CriarVoluntarioUseCase cria voluntário e registra auditoria com autor autenticado', async () => {
  const createdVoluntarios: Array<ReturnType<Voluntario['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; entidade: string; entidadeId: string; actor: unknown }> =
    [];

  const useCase = new CriarVoluntarioUseCase(
    {
      create: async (voluntario) => {
        createdVoluntarios.push(voluntario.toJSON());
      },
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => null,
      findByCpf: async () => null,
      findByEmail: async () => null,
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
          actor: input.actor,
        });
      },
    },
  );

  const result = await useCase.execute(
    {
      nomeCompleto: 'Maria Silva',
      cpf: '123.456.789-00',
      dataNascimento: '1995-06-15',
      email: 'MARIA@EXAMPLE.COM',
      telefone: '41999990000',
      endereco: 'Rua A, 123',
      dataEntrada: '2026-01-10',
    },
    {
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
    },
  );

  assert.equal(createdVoluntarios.length, 1);
  assert.equal(result.nomeCompleto, 'Maria Silva');
  assert.equal(result.cpf, '12345678900');
  assert.equal(result.email, 'maria@example.com');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'voluntario.criado');
  assert.equal(auditEntries[0].entidade, 'voluntario');
  assert.equal(auditEntries[0].entidadeId, result.id);
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
});

const createVoluntarioExistente = () =>
  Voluntario.load({
    id: 'vol-existente',
    nomeCompleto: 'João Existente',
    cpf: '12345678900',
    dataNascimento: '1990-01-01',
    email: 'joao@example.com',
    telefone: '41999990000',
    endereco: 'Rua X, 1',
    dataEntrada: '2025-01-01',
    dataSaida: null,
    ativo: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z',
  });

test('CriarVoluntarioUseCase cria voluntário sem actor autenticado', async () => {
  const useCase = new CriarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => null,
      findByCpf: async () => null,
      findByEmail: async () => null,
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
    nomeCompleto: 'Maria Silva',
    cpf: '12345678900',
    dataNascimento: '1995-06-15',
    email: 'maria@example.com',
    telefone: '41999990000',
    endereco: 'Rua A, 123',
    dataEntrada: '2026-01-10',
  });

  assert.equal(result.nomeCompleto, 'Maria Silva');
  assert.equal(result.ativo, true);
});

test('CriarVoluntarioUseCase lança ConflictError quando CPF já está cadastrado', async () => {
  const useCase = new CriarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => null,
      findByCpf: async () => createVoluntarioExistente(),
      findByEmail: async () => null,
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
      useCase.execute({
        nomeCompleto: 'Maria Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1995-06-15',
        email: 'maria@example.com',
        telefone: '41999990000',
        endereco: 'Rua A, 123',
        dataEntrada: '2026-01-10',
      }),
    (err) => {
      assert.ok(err instanceof ConflictError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});

test('CriarVoluntarioUseCase lança ConflictError quando e-mail já está cadastrado', async () => {
  const useCase = new CriarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => null,
      findByCpf: async () => null,
      findByEmail: async () => createVoluntarioExistente(),
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
      useCase.execute({
        nomeCompleto: 'Maria Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1995-06-15',
        email: 'maria@example.com',
        telefone: '41999990000',
        endereco: 'Rua A, 123',
        dataEntrada: '2026-01-10',
      }),
    (err) => {
      assert.ok(err instanceof ConflictError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});
