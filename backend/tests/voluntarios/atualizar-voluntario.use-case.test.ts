import assert from 'node:assert/strict';
import test from 'node:test';

import { AtualizarVoluntarioUseCase } from '../../src/application/voluntarios/use-cases/atualizar-voluntario.use-case';
import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { ConflictError } from '../../src/shared/errors/conflict-error';
import { HttpError } from '../../src/shared/errors/http-error';

const createVoluntarioExistente = () =>
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

test('AtualizarVoluntarioUseCase atualiza voluntário e registra auditoria com snapshots', async () => {
  const updatedVoluntarios: Array<ReturnType<Voluntario['toJSON']>> = [];
  const auditEntries: Array<{ acao: string; dadosAnteriores: unknown; dadosNovos: unknown; actor: unknown }> = [];

  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async (voluntario) => {
        updatedVoluntarios.push(voluntario.toJSON());
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
    'vol-1',
    {
      nomeCompleto: 'Maria Souza',
      cpf: '123.456.789-00',
      dataNascimento: '1995-06-15',
      email: 'MARIA@EXAMPLE.COM',
      telefone: '41988880000',
      endereco: 'Rua B, 456',
      dataEntrada: '2026-01-10',
    },
    {
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
    },
  );

  assert.equal(updatedVoluntarios.length, 1);
  assert.equal(result.nomeCompleto, 'Maria Souza');
  assert.equal(result.cpf, '12345678900');
  assert.equal(result.email, 'maria@example.com');
  assert.equal(result.telefone, '41988880000');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'voluntario.atualizado');
  assert.ok(auditEntries[0].dadosAnteriores !== null, 'dadosAnteriores deve ser preenchido');
  assert.ok(auditEntries[0].dadosNovos !== null, 'dadosNovos deve ser preenchido');
  assert.equal((auditEntries[0].dadosAnteriores as ReturnType<Voluntario['toJSON']>).nomeCompleto, 'Maria Silva');
  assert.equal((auditEntries[0].dadosNovos as ReturnType<Voluntario['toJSON']>).nomeCompleto, 'Maria Souza');
  assert.deepEqual(auditEntries[0].actor, {
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
  });
});

test('AtualizarVoluntarioUseCase atualiza voluntário sem actor autenticado', async () => {
  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
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

  const result = await useCase.execute('vol-1', {
    nomeCompleto: 'Maria Souza',
    cpf: '12345678900',
    dataNascimento: '1995-06-15',
    email: 'maria@example.com',
    telefone: '41988880000',
    endereco: 'Rua B, 456',
    dataEntrada: '2026-01-10',
  });

  assert.equal(result.nomeCompleto, 'Maria Souza');
});

test('AtualizarVoluntarioUseCase lança 404 quando voluntário não existe', async () => {
  const useCase = new AtualizarVoluntarioUseCase(
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

  await assert.rejects(
    () =>
      useCase.execute('inexistente', {
        nomeCompleto: 'Qualquer',
        cpf: '000.000.000-00',
        dataNascimento: '2000-01-01',
        email: 'qualquer@example.com',
        telefone: '41000000000',
        endereco: 'Rua X',
        dataEntrada: '2026-01-01',
      }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    },
  );
});

const inputPadrao = {
  nomeCompleto: 'Maria Souza',
  cpf: '123.456.789-00',
  dataNascimento: '1995-06-15',
  email: 'maria@example.com',
  telefone: '41988880000',
  endereco: 'Rua B, 456',
  dataEntrada: '2026-01-10',
};

test('AtualizarVoluntarioUseCase não lança conflito quando CPF pertence ao próprio voluntário', async () => {
  const voluntarioMesmoId = createVoluntarioExistente();

  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
      findByCpf: async () => voluntarioMesmoId,
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

  const result = await useCase.execute('vol-1', inputPadrao);
  assert.equal(result.nomeCompleto, 'Maria Souza');
});

test('AtualizarVoluntarioUseCase não lança conflito quando e-mail pertence ao próprio voluntário', async () => {
  const voluntarioMesmoId = createVoluntarioExistente();

  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
      findByCpf: async () => null,
      findByEmail: async () => voluntarioMesmoId,
      update: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  const result = await useCase.execute('vol-1', inputPadrao);
  assert.equal(result.nomeCompleto, 'Maria Souza');
});

test('AtualizarVoluntarioUseCase lança 409 quando CPF pertence a outro voluntário', async () => {
  const outroCpf = Voluntario.load({
    id: 'vol-outro',
    nomeCompleto: 'Outro Voluntário',
    cpf: '12345678900',
    dataNascimento: '1990-01-01',
    email: 'outro@example.com',
    telefone: '41000000000',
    endereco: 'Rua Z',
    dataEntrada: '2025-01-01',
    dataSaida: null,
    ativo: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z',
  });

  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
      findByCpf: async () => outroCpf,
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
    () => useCase.execute('vol-1', inputPadrao),
    (err) => {
      assert.ok(err instanceof ConflictError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});

test('AtualizarVoluntarioUseCase lança 409 quando e-mail pertence a outro voluntário', async () => {
  const outroEmail = Voluntario.load({
    id: 'vol-outro',
    nomeCompleto: 'Outro Voluntário',
    cpf: '99988877766',
    dataNascimento: '1990-01-01',
    email: 'maria@example.com',
    telefone: '41000000000',
    endereco: 'Rua Z',
    dataEntrada: '2025-01-01',
    dataSaida: null,
    ativo: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z',
  });

  const useCase = new AtualizarVoluntarioUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioExistente(),
      findByCpf: async () => null,
      findByEmail: async () => outroEmail,
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
    () => useCase.execute('vol-1', inputPadrao),
    (err) => {
      assert.ok(err instanceof ConflictError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});
