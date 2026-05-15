import assert from 'node:assert/strict';
import test from 'node:test';

import { Voluntario } from '../../src/domain/voluntarios/entities/voluntario';
import { ValidationError } from '../../src/shared/errors/validation-error';

const baseProps = {
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
  updatedAt: '2026-01-10T12:00:00.000Z',
};

test('Voluntario.load expõe todos os getters incluindo updatedAt', () => {
  const voluntario = Voluntario.load(baseProps);

  assert.equal(voluntario.id, 'vol-1');
  assert.equal(voluntario.nomeCompleto, 'Maria Silva');
  assert.equal(voluntario.cpf, '12345678900');
  assert.equal(voluntario.dataNascimento, '1995-06-15');
  assert.equal(voluntario.email, 'maria@example.com');
  assert.equal(voluntario.telefone, '41999990000');
  assert.equal(voluntario.endereco, 'Rua A, 123');
  assert.equal(voluntario.dataEntrada, '2026-01-10');
  assert.equal(voluntario.dataSaida, null);
  assert.equal(voluntario.ativo, true);
  assert.equal(voluntario.createdAt, '2026-01-10T10:00:00.000Z');
  assert.equal(voluntario.updatedAt, '2026-01-10T12:00:00.000Z');
});

test('Voluntario.create lança ValidationError quando nomeCompleto é apenas espaços', () => {
  assert.throws(
    () =>
      Voluntario.create({
        nomeCompleto: '   ',
        cpf: '12345678900',
        dataNascimento: '1995-06-15',
        email: 'maria@example.com',
        telefone: '41999990000',
        endereco: 'Rua A, 123',
        dataEntrada: '2026-01-10',
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('Voluntario.create lança ValidationError quando CPF não contém dígitos', () => {
  assert.throws(
    () =>
      Voluntario.create({
        nomeCompleto: 'Maria Silva',
        cpf: '---',
        dataNascimento: '1995-06-15',
        email: 'maria@example.com',
        telefone: '41999990000',
        endereco: 'Rua A, 123',
        dataEntrada: '2026-01-10',
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('Voluntario.create lança ValidationError quando email é apenas espaços', () => {
  assert.throws(
    () =>
      Voluntario.create({
        nomeCompleto: 'Maria Silva',
        cpf: '12345678900',
        dataNascimento: '1995-06-15',
        email: '   ',
        telefone: '41999990000',
        endereco: 'Rua A, 123',
        dataEntrada: '2026-01-10',
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});
