import assert from 'node:assert/strict';
import test from 'node:test';

import { RegistroAuditoria } from '../../src/domain/auditoria/entities/registro-auditoria';

const baseInput = {
  usuarioId: 1,
  usuarioNome: 'Antonio',
  usuarioEmail: 'antonio@example.com',
  acao: 'voluntario.criado' as const,
  entidade: 'voluntario' as const,
  entidadeId: 'vol-1',
  descricao: 'Voluntário criado.',
  dadosAnteriores: null,
  dadosNovos: { id: 'vol-1', nomeCompleto: 'Antonio' },
};

test('RegistroAuditoria.create gera id e createdAt automaticamente', () => {
  const registro = RegistroAuditoria.create(baseInput);

  assert.ok(registro.id.length > 0, 'id deve ser gerado');
  assert.match(
    registro.id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    'id deve ser um UUID',
  );
  assert.ok(registro.createdAt.length > 0, 'createdAt deve ser gerado');
  assert.ok(!Number.isNaN(Date.parse(registro.createdAt)), 'createdAt deve ser uma data ISO válida');
});

test('RegistroAuditoria.create ids únicos a cada chamada', () => {
  const a = RegistroAuditoria.create(baseInput);
  const b = RegistroAuditoria.create(baseInput);

  assert.notEqual(a.id, b.id);
});

test('RegistroAuditoria.create faz trim na descrição', () => {
  const registro = RegistroAuditoria.create({ ...baseInput, descricao: '  Com espaços  ' });

  assert.equal(registro.descricao, 'Com espaços');
});

test('RegistroAuditoria.create armazena dadosAnteriores e dadosNovos corretamente', () => {
  const dadosNovos = { campo: 'valor' };
  const registro = RegistroAuditoria.create({
    ...baseInput,
    dadosAnteriores: null,
    dadosNovos,
  });

  assert.equal(registro.dadosAnteriores, null);
  assert.deepEqual(registro.dadosNovos, dadosNovos);
});

test('RegistroAuditoria.create preserva dadosAnteriores quando não é null', () => {
  const dadosAnteriores = { nomeCompleto: 'Antes', cpf: '00000000000' };
  const registro = RegistroAuditoria.create({
    ...baseInput,
    dadosAnteriores,
    dadosNovos: { nomeCompleto: 'Depois' },
  });

  assert.deepEqual(registro.dadosAnteriores, dadosAnteriores);
});

test('RegistroAuditoria.create converte dadosAnteriores/dadosNovos undefined para null', () => {
  const registro = RegistroAuditoria.create({
    ...baseInput,
    dadosAnteriores: undefined as unknown as null,
    dadosNovos: undefined as unknown as null,
  });

  assert.equal(registro.dadosAnteriores, null);
  assert.equal(registro.dadosNovos, null);
});

test('RegistroAuditoria.load preserva todos os props', () => {
  const props = {
    id: 'reg-1',
    usuarioId: 2,
    usuarioNome: 'Ricardo',
    usuarioEmail: 'ricardo@example.com',
    acao: 'oficina.criada' as const,
    entidade: 'oficina' as const,
    entidadeId: 'ofic-1',
    descricao: 'Oficina criada.',
    dadosAnteriores: null,
    dadosNovos: { nome: 'Oficina de Lógica' },
    createdAt: '2026-01-01T10:00:00.000Z',
  };

  const registro = RegistroAuditoria.load(props);

  assert.equal(registro.id, 'reg-1');
  assert.equal(registro.usuarioId, 2);
  assert.equal(registro.usuarioNome, 'Ricardo');
  assert.equal(registro.usuarioEmail, 'ricardo@example.com');
  assert.equal(registro.acao, 'oficina.criada');
  assert.equal(registro.entidade, 'oficina');
  assert.equal(registro.entidadeId, 'ofic-1');
  assert.equal(registro.descricao, 'Oficina criada.');
  assert.equal(registro.dadosAnteriores, null);
  assert.deepEqual(registro.dadosNovos, { nome: 'Oficina de Lógica' });
  assert.equal(registro.createdAt, '2026-01-01T10:00:00.000Z');
});

test('RegistroAuditoria.load aceita usuarioId null (ação sem autenticação)', () => {
  const registro = RegistroAuditoria.load({
    ...{
      id: 'reg-2',
      usuarioId: null,
      usuarioNome: null,
      usuarioEmail: null,
      acao: 'voluntario.criado' as const,
      entidade: 'voluntario' as const,
      entidadeId: 'vol-1',
      descricao: 'Criado sem ator.',
      dadosAnteriores: null,
      dadosNovos: null,
      createdAt: '2026-01-01T10:00:00.000Z',
    },
  });

  assert.equal(registro.usuarioId, null);
  assert.equal(registro.usuarioNome, null);
  assert.equal(registro.usuarioEmail, null);
  assert.equal(registro.dadosAnteriores, null);
  assert.equal(registro.dadosNovos, null);
});

test('RegistroAuditoria.toJSON retorna todos os campos', () => {
  const props = {
    id: 'reg-3',
    usuarioId: 1,
    usuarioNome: 'Antonio',
    usuarioEmail: 'antonio@example.com',
    acao: 'atuacao.associada' as const,
    entidade: 'atuacao' as const,
    entidadeId: 'atu-1',
    descricao: 'Vínculo criado.',
    dadosAnteriores: null,
    dadosNovos: { voluntarioId: 'vol-1', oficinaId: 'ofic-1' },
    createdAt: '2026-05-01T12:00:00.000Z',
  };

  const registro = RegistroAuditoria.load(props);
  const json = registro.toJSON();

  assert.deepEqual(json, props);
});
