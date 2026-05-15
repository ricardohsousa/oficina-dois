import test from 'node:test';
import assert from 'node:assert/strict';

import { GerarTermoVoluntariadoUseCase } from '../../src/application/termos/use-cases/gerar-termo-voluntariado.use-case';
import type { HistoricoAtuacao } from '../../src/domain/atuacoes/repositories/atuacao.repository';
import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { HttpError } from '../../src/shared/errors/http-error';
import { ValidationError } from '../../src/shared/errors/validation-error';

const createVoluntario = (overrides?: Partial<ReturnType<Voluntario['toJSON']>>) =>
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
    ...overrides,
  });

const createHistorico = (): HistoricoAtuacao[] => [
  {
    id: 'atu-1',
    voluntarioId: 'vol-1',
    oficinaId: 'ofi-1',
    dataInicio: '2026-03-01',
    dataFim: '2026-03-20',
    cargaHoraria: 12,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
    oficina: {
      id: 'ofi-1',
      nome: 'Oficina de Logica',
      descricao: 'Introducao a logica',
      status: 'inativa',
      dataInicio: '2026-02-15',
      dataFim: '2026-03-30',
    },
  },
];

test('GerarTermoVoluntariadoUseCase gera PDF, salva referencia e retorna metadados', async () => {
  const pdfBuffer = Buffer.from('pdf-content');
  const savedTerms: Array<{ id: string; nomeArquivo: string; caminhoArquivo: string }> = [];
  const auditEntries: Array<{ acao: string; entidade: string; entidadeId: string }> = [];
  let receivedDescription = '';

  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => createHistorico(),
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async (termo) => {
        savedTerms.push({
          id: termo.id,
          nomeArquivo: termo.nomeArquivo,
          caminhoArquivo: termo.caminhoArquivo,
        });
      },
      findById: async () => null,
    },
    {
      generate: async (data) => {
        receivedDescription = data.descricaoAtuacao;
        return pdfBuffer;
      },
    },
    {
      save: async (fileName, content) => {
        assert.equal(content, pdfBuffer);
        return `storage/termos/${fileName}`;
      },
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
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
        });
      },
    },
  );

  const result = await useCase.execute('vol-1');

  assert.match(receivedDescription, /Oficina de Logica/);
  assert.equal(savedTerms.length, 1);
  assert.equal(result.id, savedTerms[0].id);
  assert.equal(result.voluntarioId, 'vol-1');
  assert.equal(result.mimeType, 'application/pdf');
  assert.deepEqual(auditEntries, [
    {
      acao: 'termo.gerado',
      entidade: 'termo_voluntariado',
      entidadeId: result.id,
    },
  ]);
  assert.match(
    result.nomeArquivo,
    /^termo-voluntariado-maria-silva-\d{4}-\d{2}-\d{2}-[0-9a-f-]{36}\.pdf$/,
  );
  assert.equal(result.downloadUrl, `/termos/${result.id}/download`);
});

test('GerarTermoVoluntariadoUseCase gera nomes de arquivo distintos para o mesmo voluntario', async () => {
  const generatedFileNames: string[] = [];

  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => createHistorico(),
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    { generate: async () => Buffer.from('pdf-content') },
    {
      save: async (fileName) => {
        generatedFileNames.push(fileName);
        return `storage/termos/${fileName}`;
      },
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await useCase.execute('vol-1');
  await useCase.execute('vol-1');

  assert.equal(generatedFileNames.length, 2);
  assert.notEqual(generatedFileNames[0], generatedFileNames[1]);
});

test('GerarTermoVoluntariadoUseCase retorna 404 quando o voluntario nao existe', async () => {
  const useCase = new GerarTermoVoluntariadoUseCase(
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
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    { generate: async () => Buffer.alloc(0) },
    {
      save: async () => 'storage/termos/x.pdf',
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('vol-inexistente'),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      return true;
    },
  );
});

test('GerarTermoVoluntariadoUseCase valida dados obrigatorios pendentes', async () => {
  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario({ email: '   ' }),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    {
      generate: async () => {
        throw new Error('nao deveria gerar pdf');
      },
    },
    {
      save: async () => 'storage/termos/x.pdf',
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('vol-1'),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.status, 400);
      assert.equal(error.errors?.[0]?.field, 'email');
      return true;
    },
  );
});

test('GerarTermoVoluntariadoUseCase exclui arquivo e repropaga erro quando transacao falha', async () => {
  const deletedPaths: string[] = [];
  const transactionError = new Error('falha na transação');

  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => createHistorico(),
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    { generate: async () => Buffer.from('pdf-content') },
    {
      save: async (fileName) => `storage/termos/${fileName}`,
      read: async () => Buffer.alloc(0),
      delete: async (path) => {
        deletedPaths.push(path);
      },
    },
    {
      runInTransaction: async () => {
        throw transactionError;
      },
    },
    {
      execute: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('vol-1'),
    (error: unknown) => {
      assert.equal(error, transactionError);
      return true;
    },
  );

  assert.equal(deletedPaths.length, 1);
  assert.match(deletedPaths[0], /storage\/termos\//);
});

test('GerarTermoVoluntariadoUseCase gera descricao sem historico de atuacao', async () => {
  let receivedDescription = '';

  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => [],
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    {
      generate: async (data) => {
        receivedDescription = data.descricaoAtuacao;
        return Buffer.from('pdf-content');
      },
    },
    {
      save: async (fileName) => `storage/termos/${fileName}`,
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await useCase.execute('vol-1');

  assert.equal(receivedDescription, 'Sem histórico de atuação registrado até a data de geração.');
});

test('GerarTermoVoluntariadoUseCase formata item de historico sem dataFim e sem cargaHoraria', async () => {
  let receivedDescription = '';

  const historicoSemFim: HistoricoAtuacao[] = [
    {
      id: 'atu-2',
      voluntarioId: 'vol-1',
      oficinaId: 'ofi-2',
      dataInicio: '2026-04-01',
      dataFim: null,
      cargaHoraria: null,
      createdAt: '2026-04-01T10:00:00.000Z',
      updatedAt: '2026-04-01T10:00:00.000Z',
      oficina: {
        id: 'ofi-2',
        nome: 'Oficina de Robótica',
        descricao: 'Robótica educacional',
        status: 'ativa',
        dataInicio: '2026-04-01',
        dataFim: null,
      },
    },
  ];

  const useCase = new GerarTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findAll: async () => [],
      findWithFilters: async () => [],
      findById: async () => createVoluntario(),
      findByCpf: async () => null,
      findByEmail: async () => null,
      update: async () => undefined,
    },
    {
      create: async () => undefined,
      findByVoluntario: async () => [],
      findHistoricoByVoluntario: async () => historicoSemFim,
      findByVoluntarioAndOficina: async () => null,
      reconcileForVoluntarioInactivation: async () => undefined,
    },
    {
      create: async () => undefined,
      findById: async () => null,
    },
    {
      generate: async (data) => {
        receivedDescription = data.descricaoAtuacao;
        return Buffer.from('pdf-content');
      },
    },
    {
      save: async (fileName) => `storage/termos/${fileName}`,
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
    {
      runInTransaction: async (operation) => operation({ transaction: {} }),
    },
    {
      execute: async () => undefined,
    },
  );

  await useCase.execute('vol-1');

  assert.match(receivedDescription, /atual/);
  assert.doesNotMatch(receivedDescription, /carga horária/);
});
