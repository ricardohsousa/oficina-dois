import assert from 'node:assert/strict';
import test from 'node:test';

import { Oficina } from '../../src/domain/oficinas/entities/oficina';
import { ValidationError } from '../../src/shared/errors/validation-error';

test('Oficina.create com dataFim fornecida preserva o valor', () => {
  const oficina = Oficina.create({
    nome: 'Oficina de Lógica',
    descricao: 'Ensino lúdico',
    dataInicio: '2026-03-01',
    dataFim: '2026-06-30',
  });

  assert.equal(oficina.dataFim, '2026-06-30');
  assert.equal(oficina.status, 'ativa');
  assert.equal(oficina.ativa, true);
});

test('Oficina.create sem dataFim usa null por padrão', () => {
  const oficina = Oficina.create({
    nome: 'Oficina de Robótica',
    descricao: 'Robótica educacional',
    dataInicio: '2026-04-01',
  });

  assert.equal(oficina.dataFim, null);
});

test('Oficina.create gera id único e timestamps', () => {
  const a = Oficina.create({ nome: 'A', descricao: 'desc', dataInicio: '2026-01-01' });
  const b = Oficina.create({ nome: 'B', descricao: 'desc', dataInicio: '2026-01-01' });

  assert.notEqual(a.id, b.id);
  assert.ok(!Number.isNaN(Date.parse(a.createdAt)));
  assert.ok(!Number.isNaN(Date.parse(a.updatedAt)));
});

test('Oficina.create lança ValidationError quando nome é vazio', () => {
  assert.throws(
    () => Oficina.create({ nome: '  ', descricao: 'desc', dataInicio: '2026-01-01' }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('Oficina.load preserva todos os campos e toJSON os retorna', () => {
  const props = {
    id: 'ofic-1',
    nome: 'Oficina de Lógica',
    descricao: 'Ensino lúdico',
    status: 'ativa' as const,
    dataInicio: '2026-03-01',
    dataFim: '2026-06-30',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  };

  const oficina = Oficina.load(props);

  assert.equal(oficina.id, 'ofic-1');
  assert.equal(oficina.nome, 'Oficina de Lógica');
  assert.equal(oficina.status, 'ativa');
  assert.equal(oficina.dataFim, '2026-06-30');
  assert.equal(oficina.ativa, true);
  assert.deepEqual(oficina.toJSON(), props);
});

test('Oficina.load com status inativa expõe ativa como false', () => {
  const oficina = Oficina.load({
    id: 'ofic-2',
    nome: 'Encerrada',
    descricao: 'desc',
    status: 'inativa',
    dataInicio: '2025-01-01',
    dataFim: '2025-06-01',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
  });

  assert.equal(oficina.ativa, false);
});
