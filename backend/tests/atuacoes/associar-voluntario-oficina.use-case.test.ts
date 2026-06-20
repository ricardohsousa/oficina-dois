import assert from 'node:assert/strict';
import test from 'node:test';

import { AssociarVoluntarioOficinaUseCase } from '../../src/application/atuacoes/use-cases/associar-voluntario-oficina.use-case';
import { Atuacao } from '../../src/domain/atuacoes/entities/atuacao';
import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { Oficina } from '../../src/domain/oficinas/entities/oficina';
import { HttpError } from '../../src/shared/errors/http-error';

const createVoluntarioAtivo = () =>
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

const createOficinaAtiva = () =>
  Oficina.load({
    id: 'ofic-1',
    nome: 'Oficina de Lógica',
    descricao: 'Ensino lúdico',
    status: 'ativa',
    dataInicio: '2026-03-01',
    dataFim: null,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  });

const makeUseCase = (overrides: {
  findVoluntario?: () => Promise<Voluntario | null>;
  findOficina?: () => Promise<Oficina | null>;
  findByVoluntarioAndOficina?: () => Promise<Atuacao | null>;
}) => {
  return new AssociarVoluntarioOficinaUseCase(
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: overrides.findByVoluntarioAndOficina ?? (async () => null),
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: overrides.findVoluntario ?? (async () => createVoluntarioAtivo()),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: overrides.findOficina ?? (async () => createOficinaAtiva()),
      update: async () => undefined,
    },
    {
      isProfessorOfOficina: async () => true,
      findByProfessorId: async () => [],
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );
};

test('AssociarVoluntarioOficinaUseCase cria vínculo e registra auditoria', async () => {
  const createdAtuacoes: unknown[] = [];
  const auditEntries: Array<{ acao: string; entidade: string; dadosAnteriores: unknown }> = [];

  const useCase = new AssociarVoluntarioOficinaUseCase(
    {
      create: async (atuacao) => {
        createdAtuacoes.push(atuacao.toJSON());
      },
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntarioAtivo(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findAll: async () => [],
      findById: async () => createOficinaAtiva(),
      update: async () => undefined,
    },
    {
      isProfessorOfOficina: async () => true,
      findByProfessorId: async () => [],
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async (input) => {
        auditEntries.push({
          acao: input.acao,
          entidade: input.entidade,
          dadosAnteriores: input.dadosAnteriores,
        });
      },
    },
  );

  const result = await useCase.execute(
    'vol-1',
    { oficinaId: 'ofic-1', dataInicio: '2026-03-01' },
    {
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
    },
  );

  assert.equal(createdAtuacoes.length, 1);
  assert.equal(result.voluntarioId, 'vol-1');
  assert.equal(result.oficinaId, 'ofic-1');
  assert.equal(auditEntries.length, 1);
  assert.equal(auditEntries[0].acao, 'atuacao.associada');
  assert.equal(auditEntries[0].entidade, 'atuacao');
  assert.equal(auditEntries[0].dadosAnteriores, null);
});

test('AssociarVoluntarioOficinaUseCase lança 409 quando voluntário está inativo', async () => {
  const voluntarioInativo = Voluntario.load({
    id: 'vol-2',
    nomeCompleto: 'João Inativo',
    cpf: '98765432100',
    dataNascimento: '1990-01-01',
    email: 'joao@example.com',
    telefone: '41000000000',
    endereco: 'Rua Z',
    dataEntrada: '2025-01-01',
    dataSaida: '2025-12-01',
    ativo: false,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-12-01T10:00:00.000Z',
  });

  const useCase = makeUseCase({ findVoluntario: async () => voluntarioInativo });

  await assert.rejects(
    () => useCase.execute('vol-2', { oficinaId: 'ofic-1', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});

test('AssociarVoluntarioOficinaUseCase lança 409 quando oficina está inativa', async () => {
  const oficinaInativa = Oficina.load({
    id: 'ofic-2',
    nome: 'Oficina Encerrada',
    descricao: 'Inativa',
    status: 'inativa',
    dataInicio: '2025-01-01',
    dataFim: '2025-06-01',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
  });

  const useCase = makeUseCase({ findOficina: async () => oficinaInativa });

  await assert.rejects(
    () => useCase.execute('vol-1', { oficinaId: 'ofic-2', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 409);
      return true;
    },
  );
});

test('AssociarVoluntarioOficinaUseCase lança 404 quando voluntário não existe', async () => {
  const useCase = makeUseCase({ findVoluntario: async () => null });

  await assert.rejects(
    () => useCase.execute('inexistente', { oficinaId: 'ofic-1', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    },
  );
});

test('AssociarVoluntarioOficinaUseCase lança 404 quando oficina não existe', async () => {
  const useCase = makeUseCase({ findOficina: async () => null });

  await assert.rejects(
    () => useCase.execute('vol-1', { oficinaId: 'inexistente', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    },
  );
});

test('AssociarVoluntarioOficinaUseCase lança 409 quando vínculo já existe', async () => {
  const atuacaoExistente = Atuacao.load({
    id: 'atu-1',
    voluntarioId: 'vol-1',
    oficinaId: 'ofic-1',
    dataInicio: '2026-01-01',
    dataFim: null,
    cargaHoraria: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  });

  const useCase = makeUseCase({
    findByVoluntarioAndOficina: async () => atuacaoExistente,
  });

  await assert.rejects(
    () => useCase.execute('vol-1', { oficinaId: 'ofic-1', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /já está associado/i);
      return true;
    },
  );
});
