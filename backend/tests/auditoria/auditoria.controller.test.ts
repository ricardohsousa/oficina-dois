import assert from 'node:assert/strict';
import test from 'node:test';

import { AuditoriaController } from '../../src/interfaces/http/controllers/auditoria.controller';
import { HttpError } from '../../src/shared/errors/http-error';

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

test('AuditoriaController.list responde 200 com filtros válidos', async () => {
  const registros = [
    {
      id: 'aud-1',
      usuarioId: 1,
      usuarioNome: 'Antonio',
      usuarioEmail: 'antonio@example.com',
      acao: 'voluntario.criado',
      entidade: 'voluntario',
      entidadeId: 'vol-1',
      descricao: 'Voluntário cadastrado.',
      dadosAnteriores: null,
      dadosNovos: { nomeCompleto: 'Maria Silva' },
      createdAt: '2026-05-14T10:00:00.000Z',
    },
  ];

  let receivedFilters: unknown;

  const controller = new AuditoriaController({
    execute: async (filters) => {
      receivedFilters = filters;
      return registros;
    },
  });

  const request = {
    query: {
      acao: 'voluntario.criado',
      entidade: 'voluntario',
      entidadeId: 'vol-1',
      usuarioId: '1',
    },
  };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.list(request as never, response as never, (error?: unknown) => {
    if (error !== undefined) {
      nextCalls.push(error);
    }
  });

  assert.deepEqual(receivedFilters, {
    acao: 'voluntario.criado',
    entidade: 'voluntario',
    entidadeId: 'vol-1',
    usuarioId: 1,
  });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, registros);
  assert.deepEqual(nextCalls, []);
});

test('AuditoriaController.list encaminha erro de validação para usuarioId inválido', async () => {
  const controller = new AuditoriaController({
    execute: async () => {
      throw new Error('não deveria executar');
    },
  });

  const request = {
    query: {
      usuarioId: 'abc',
    },
  };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.list(request as never, response as never, (error?: unknown) => {
    nextCalls.push(error);
  });

  assert.equal(response.statusCode, 0);
  assert.equal(nextCalls.length, 1);
  assert.ok(nextCalls[0] instanceof HttpError);
  assert.equal((nextCalls[0] as HttpError).status, 400);
});

test('AuditoriaController.list responde 200 sem usuarioId na query', async () => {
  let receivedFilters: unknown;

  const controller = new AuditoriaController({
    execute: async (filters) => {
      receivedFilters = filters;
      return [];
    },
  });

  const request = { query: { entidade: 'voluntario' } };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.list(request as never, response as never, (error?: unknown) => {
    if (error !== undefined) nextCalls.push(error);
  });

  assert.deepEqual(receivedFilters, {
    acao: undefined,
    entidade: 'voluntario',
    entidadeId: undefined,
    usuarioId: undefined,
  });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(nextCalls, []);
});

test('AuditoriaController.list encaminha erro do use case para o next middleware', async () => {
  const expectedError = new Error('falha ao listar');

  const controller = new AuditoriaController({
    execute: async () => {
      throw expectedError;
    },
  });

  const request = { query: {} };
  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.list(request as never, response as never, (error?: unknown) => {
    nextCalls.push(error);
  });

  assert.equal(response.statusCode, 0);
  assert.deepEqual(nextCalls, [expectedError]);
});
