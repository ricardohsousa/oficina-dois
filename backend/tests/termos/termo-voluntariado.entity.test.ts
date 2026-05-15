import assert from 'node:assert/strict';
import test from 'node:test';

import { TermoVoluntariado } from '../../src/domain/termos/entities/termo-voluntariado';

test('TermoVoluntariado.create usa application/pdf como mimeType padrão', () => {
  const termo = TermoVoluntariado.create({
    voluntarioId: 'vol-1',
    nomeArquivo: 'termo.pdf',
    caminhoArquivo: 'storage/termos/termo.pdf',
  });

  assert.equal(termo.mimeType, 'application/pdf');
});

test('TermoVoluntariado.create com mimeType personalizado preserva o valor', () => {
  const termo = TermoVoluntariado.create({
    voluntarioId: 'vol-1',
    nomeArquivo: 'termo.png',
    caminhoArquivo: 'storage/termos/termo.png',
    mimeType: 'image/png',
  });

  assert.equal(termo.mimeType, 'image/png');
});

test('TermoVoluntariado.create gera id único e timestamps', () => {
  const a = TermoVoluntariado.create({ voluntarioId: 'vol-1', nomeArquivo: 'a.pdf', caminhoArquivo: 'a' });
  const b = TermoVoluntariado.create({ voluntarioId: 'vol-1', nomeArquivo: 'b.pdf', caminhoArquivo: 'b' });

  assert.notEqual(a.id, b.id);
  assert.ok(!Number.isNaN(Date.parse(a.createdAt)));
  assert.ok(!Number.isNaN(Date.parse(a.updatedAt)));
});

test('TermoVoluntariado.load preserva todos os campos e toJSON os retorna', () => {
  const props = {
    id: 'termo-1',
    voluntarioId: 'vol-1',
    nomeArquivo: 'termo.pdf',
    caminhoArquivo: 'storage/termos/termo.pdf',
    mimeType: 'application/pdf',
    createdAt: '2026-05-14T10:00:00.000Z',
    updatedAt: '2026-05-14T10:00:00.000Z',
  };

  const termo = TermoVoluntariado.load(props);

  assert.equal(termo.id, 'termo-1');
  assert.equal(termo.voluntarioId, 'vol-1');
  assert.equal(termo.nomeArquivo, 'termo.pdf');
  assert.equal(termo.caminhoArquivo, 'storage/termos/termo.pdf');
  assert.equal(termo.mimeType, 'application/pdf');
  assert.deepEqual(termo.toJSON(), props);
});
