import test from 'node:test';
import assert from 'node:assert/strict';

import { DownloadTermoVoluntariadoUseCase } from '../../src/application/termos/use-cases/download-termo-voluntariado.use-case';
import { TermoVoluntariado } from '../../src/domain/termos/entities/termo-voluntariado';
import { HttpError } from '../../src/shared/errors/http-error';

const createTermo = () =>
  TermoVoluntariado.load({
    id: 'termo-1',
    voluntarioId: 'vol-1',
    nomeArquivo: 'termo.pdf',
    caminhoArquivo: 'storage/termos/termo.pdf',
    mimeType: 'application/pdf',
    createdAt: '2026-05-14T10:00:00.000Z',
    updatedAt: '2026-05-14T10:00:00.000Z',
  });

test('DownloadTermoVoluntariadoUseCase retorna o arquivo PDF quando o termo existe', async () => {
  const buffer = Buffer.from('pdf-content');
  const useCase = new DownloadTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findById: async () => createTermo(),
    },
    {
      save: async () => 'storage/termos/termo.pdf',
      read: async (path) => {
        assert.equal(path, 'storage/termos/termo.pdf');
        return buffer;
      },
      delete: async () => undefined,
    },
  );

  const result = await useCase.execute('termo-1');

  assert.equal(result.fileName, 'termo.pdf');
  assert.equal(result.mimeType, 'application/pdf');
  assert.equal(result.content, buffer);
});

test('DownloadTermoVoluntariadoUseCase retorna 404 quando o termo nao existe', async () => {
  const useCase = new DownloadTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findById: async () => null,
    },
    {
      save: async () => 'storage/termos/x.pdf',
      read: async () => Buffer.alloc(0),
      delete: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('termo-inexistente'),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      assert.equal(error.detail, 'Termo de voluntariado não encontrado.');
      return true;
    },
  );
});

test('DownloadTermoVoluntariadoUseCase retorna 404 quando o arquivo nao existe no storage', async () => {
  const useCase = new DownloadTermoVoluntariadoUseCase(
    {
      create: async () => undefined,
      findById: async () => createTermo(),
    },
    {
      save: async () => 'storage/termos/x.pdf',
      read: async () => {
        throw new Error('arquivo ausente');
      },
      delete: async () => undefined,
    },
  );

  await assert.rejects(
    () => useCase.execute('termo-1'),
    (error: unknown) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      assert.equal(error.detail, 'Arquivo do termo de voluntariado não encontrado.');
      return true;
    },
  );
});
