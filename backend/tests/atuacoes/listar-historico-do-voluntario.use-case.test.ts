import test from 'node:test';
import assert from 'node:assert/strict';

import { ListarHistoricoDoVoluntarioUseCase } from '../../src/application/atuacoes/use-cases/listar-historico-do-voluntario.use-case';
import type { HistoricoAtuacao } from '../../src/domain/atuacoes/repositories/atuacao.repository';
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

test('ListarHistoricoDoVoluntarioUseCase retorna o historico do voluntario existente', async () => {
  const historico = createHistorico();
  let receivedId: string | null = null;

  const atuacaoRepository = {
    create: async () => undefined,
    findByVoluntario: async () => [],
    findHistoricoByVoluntario: async (voluntarioId: string) => {
      receivedId = voluntarioId;
      return historico;
    },
    findByVoluntarioAndOficina: async () => null,
    reconcileForVoluntarioInactivation: async () => undefined,
  };

  const voluntarioRepository = {
    create: async () => undefined,
    findAll: async () => [],
    findWithFilters: async () => [],
    findById: async () => createVoluntario(),
    findByCpf: async () => null,
    findByEmail: async () => null,
    update: async () => undefined,
  };

  const useCase = new ListarHistoricoDoVoluntarioUseCase(
    atuacaoRepository,
    voluntarioRepository,
  );

  const result = await useCase.execute('vol-1');

  assert.equal(receivedId, 'vol-1');
  assert.deepEqual(result, historico);
});

test('ListarHistoricoDoVoluntarioUseCase retorna 404 quando o voluntario nao existe', async () => {
  const atuacaoRepository = {
    create: async () => undefined,
    findByVoluntario: async () => [],
    findHistoricoByVoluntario: async () => {
      throw new Error('nao deveria consultar historico');
    },
    findByVoluntarioAndOficina: async () => null,
    reconcileForVoluntarioInactivation: async () => undefined,
  };

  const voluntarioRepository = {
    create: async () => undefined,
    findAll: async () => [],
    findWithFilters: async () => [],
    findById: async () => null,
    findByCpf: async () => null,
    findByEmail: async () => null,
    update: async () => undefined,
  };

  const useCase = new ListarHistoricoDoVoluntarioUseCase(
    atuacaoRepository,
    voluntarioRepository,
  );

  await assert.rejects(
    () => useCase.execute('vol-inexistente'),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      assert.equal(error.detail, 'Voluntário não encontrado.');
      return true;
    },
  );
});
