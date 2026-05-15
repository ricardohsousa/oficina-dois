import test from 'node:test';
import assert from 'node:assert/strict';

import { TermosController } from '../../src/interfaces/http/controllers/termos.controller';

const createResponse = () => {
  const headers = new Map<string, string>();

  return {
    statusCode: 0,
    body: undefined as unknown,
    headers,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    send(payload: unknown) {
      this.body = payload;
      return this;
    },
    setHeader(name: string, value: string) {
      headers.set(name, value);
    },
  };
};

test('TermosController.gerar responde 201 com os metadados do termo', async () => {
  const termo = {
    id: 'termo-1',
    voluntarioId: 'vol-1',
    nomeArquivo: 'termo.pdf',
    mimeType: 'application/pdf',
    downloadUrl: '/termos/termo-1/download',
    createdAt: '2026-05-14T10:00:00.000Z',
  };

  const controller = new TermosController(
    {
      execute: async (voluntarioId: string, actor?: { usuarioId: number | null }) => {
        assert.equal(voluntarioId, 'vol-1');
        assert.equal(actor?.usuarioId, 1);
        return termo;
      },
    },
    {
      execute: async () => {
        throw new Error('nao deveria baixar');
      },
    },
  );

  const response = createResponse();

  await controller.gerar(
    {
      params: { voluntarioId: 'vol-1' },
      auth: { sub: '1', nome: 'Usuario Teste', email: 'teste@ellp.local' },
    } as never,
    response as never,
    () => undefined,
  );

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.body, termo);
});

test('TermosController.download responde 200 com headers e binario do PDF', async () => {
  const buffer = Buffer.from('pdf-content');
  const controller = new TermosController(
    {
      execute: async () => {
        throw new Error('nao deveria gerar');
      },
    },
    {
      execute: async (termoId: string) => {
        assert.equal(termoId, 'termo-1');
        return {
          fileName: 'termo.pdf',
          mimeType: 'application/pdf',
          content: buffer,
        };
      },
    },
  );

  const response = createResponse();

  await controller.download(
    { params: { termoId: 'termo-1' } } as never,
    response as never,
    () => undefined,
  );

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers.get('Content-Type'), 'application/pdf');
  assert.equal(
    response.headers.get('Content-Disposition'),
    'attachment; filename="termo.pdf"',
  );
  assert.equal(response.body, buffer);
});

test('TermosController.gerar encaminha erros para o next middleware', async () => {
  const expectedError = new Error('falha ao gerar termo');

  const controller = new TermosController(
    {
      execute: async () => {
        throw expectedError;
      },
    },
    {
      execute: async () => {
        throw new Error('nao deveria baixar');
      },
    },
  );

  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.gerar(
    { params: { voluntarioId: 'vol-1' }, auth: null } as never,
    response as never,
    (error?: unknown) => {
      nextCalls.push(error);
    },
  );

  assert.equal(response.statusCode, 0);
  assert.deepEqual(nextCalls, [expectedError]);
});

test('TermosController.download encaminha erros para o next middleware', async () => {
  const expectedError = new Error('falha ao baixar termo');

  const controller = new TermosController(
    {
      execute: async () => {
        throw new Error('nao deveria gerar');
      },
    },
    {
      execute: async () => {
        throw expectedError;
      },
    },
  );

  const response = createResponse();
  const nextCalls: unknown[] = [];

  await controller.download(
    { params: { termoId: 'termo-1' } } as never,
    response as never,
    (error?: unknown) => {
      nextCalls.push(error);
    },
  );

  assert.equal(response.statusCode, 0);
  assert.deepEqual(nextCalls, [expectedError]);
});
