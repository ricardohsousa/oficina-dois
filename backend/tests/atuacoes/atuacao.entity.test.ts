import assert from 'node:assert/strict';
import test from 'node:test';

import { Atuacao } from '../../src/domain/atuacoes/entities/atuacao';

test('Atuacao.create com dataFim e cargaHoraria fornecidos', () => {
  const atuacao = Atuacao.create({
    voluntarioId: 'vol-1',
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
    dataFim: '2026-06-30',
    cargaHoraria: 40,
  });

  assert.equal(atuacao.dataFim, '2026-06-30');
  assert.equal(atuacao.cargaHoraria, 40);
});

test('Atuacao.create sem dataFim e cargaHoraria usa null por padrão', () => {
  const atuacao = Atuacao.create({
    voluntarioId: 'vol-1',
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
  });

  assert.equal(atuacao.dataFim, null);
  assert.equal(atuacao.cargaHoraria, null);
});

test('Atuacao.create gera id único e timestamps', () => {
  const a = Atuacao.create({ voluntarioId: 'vol-1', oficinaId: 'ofic-1', dataInicio: '2026-01-01' });
  const b = Atuacao.create({ voluntarioId: 'vol-1', oficinaId: 'ofic-1', dataInicio: '2026-01-01' });

  assert.notEqual(a.id, b.id);
  assert.ok(!Number.isNaN(Date.parse(a.createdAt)));
  assert.ok(!Number.isNaN(Date.parse(a.updatedAt)));
});

test('Atuacao.load preserva todos os campos e toJSON os retorna', () => {
  const props = {
    id: 'atu-1',
    voluntarioId: 'vol-1',
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
    dataFim: '2026-06-30',
    cargaHoraria: 20,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-06-30T10:00:00.000Z',
  };

  const atuacao = Atuacao.load(props);

  assert.equal(atuacao.id, 'atu-1');
  assert.equal(atuacao.voluntarioId, 'vol-1');
  assert.equal(atuacao.oficinaId, 'ofic-1');
  assert.equal(atuacao.dataInicio, '2026-03-01');
  assert.equal(atuacao.dataFim, '2026-06-30');
  assert.equal(atuacao.cargaHoraria, 20);
  assert.equal(atuacao.createdAt, '2026-03-01T10:00:00.000Z');
  assert.equal(atuacao.updatedAt, '2026-06-30T10:00:00.000Z');
  assert.deepEqual(atuacao.toJSON(), props);
});
