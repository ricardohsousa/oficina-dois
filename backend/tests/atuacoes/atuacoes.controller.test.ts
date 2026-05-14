import test from 'node:test';
import assert from 'node:assert/strict';

import { AtuacoesController } from '../../src/interfaces/http/controllers/atuacoes.controller';

const createResponse = () => {
  const response = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test('AtuacoesController.listarHistorico responde 200 com o historico retornado pelo use case', async () => {
  const historico = [
    {
      id: 'atu-1',
      voluntarioId: 'vol-1',
      oficinaId: 'ofi-1',
      dataInicio: '2026-03-01',
      dataFim: null,
      cargaHoraria: 20,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      oficina: {
        id: 'ofi-1',
        nome: 'Oficina de Logica',
        descricao: 'Introducao',
        status: 'ativa',
        dataInicio: '2026-02-20',
        dataFim: null,
      },
    },
  ];

  const associarUseCase = {
    execute: async () => {
      throw new Error('nao deveria chamar associar');
    },
  };
  const listarAtuacoesUseCase = {
    execute: async () => {
      throw new Error('nao deveria chamar listagem simples');
    },
  };
  const listarHistoricoUseCase = {
    execute: async (voluntarioId: string) => {
      assert.equal(voluntarioId, 'vol-1');
      return historico;
    },
  };

  const controller = new AtuacoesController(
    associarUseCase,
    listarAtuacoesUseCase,
    listarHistoricoUseCase,
  );
  const request = { params: { voluntarioId: 'vol-1' } };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.listarHistorico(
    request as never,
    response as never,
    (error?: unknown) => {
      if (error !== undefined) nextCalls.push(error);
    },
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, historico);
  assert.deepEqual(nextCalls, []);
});

test('AtuacoesController.listarHistorico encaminha erros para o next middleware', async () => {
  const expectedError = new Error('falha ao buscar historico');

  const controller = new AtuacoesController(
    { execute: async () => undefined },
    { execute: async () => [] },
    {
      execute: async () => {
        throw expectedError;
      },
    },
  );

  const request = { params: { voluntarioId: 'vol-1' } };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.listarHistorico(
    request as never,
    response as never,
    (error?: unknown) => {
      nextCalls.push(error);
    },
  );

  assert.equal(response.statusCode, 0);
  assert.deepEqual(nextCalls, [expectedError]);
});
