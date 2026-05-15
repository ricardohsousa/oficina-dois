import assert from 'node:assert/strict';
import test from 'node:test';

import { redactAuditoriaPayload } from '../../src/application/auditoria/services/redact-auditoria-payload';

test('redactAuditoriaPayload retorna null para payload null', () => {
  assert.equal(redactAuditoriaPayload(null), null);
});

test('redactAuditoriaPayload retorna null para payload undefined', () => {
  assert.equal(redactAuditoriaPayload(undefined), null);
});

test('redactAuditoriaPayload mapeia itens quando payload é array', () => {
  const result = redactAuditoriaPayload([
    { cpf: '12345678900', email: 'a@b.com' },
    { cpf: '99988877766' },
  ]);

  assert.deepEqual(result, [
    { cpf: '***8900', email: 'a***@b.com' },
    { cpf: '***7766' },
  ]);
});

test('redactAuditoriaPayload retorna primitivo inalterado', () => {
  assert.equal(redactAuditoriaPayload(42), 42);
  assert.equal(redactAuditoriaPayload('texto'), 'texto');
  assert.equal(redactAuditoriaPayload(true), true);
});

test('redactAuditoriaPayload trata valor nulo dentro de objeto como primitivo', () => {
  const result = redactAuditoriaPayload({ cpf: null, nome: 'Maria' });

  assert.deepEqual(result, { cpf: null, nome: 'Maria' });
});

test('redactAuditoriaPayload retorna *** para CPF com 4 ou menos dígitos', () => {
  const result = redactAuditoriaPayload({ cpf: '123' });

  assert.deepEqual(result, { cpf: '***' });
});

test('redactAuditoriaPayload retorna *** para telefone com 4 ou menos dígitos', () => {
  const result = redactAuditoriaPayload({ telefone: '41' });

  assert.deepEqual(result, { telefone: '***' });
});

test('redactAuditoriaPayload retorna *** para email sem arroba', () => {
  const result = redactAuditoriaPayload({ email: 'invalido' });

  assert.deepEqual(result, { email: '***' });
});

test('redactAuditoriaPayload mascara dados sensíveis em objetos aninhados', () => {
  const payload = {
    cpf: '12345678900',
    email: 'maria@example.com',
    telefone: '41999990000',
    endereco: 'Rua A, 123',
    nested: {
      email: 'jo@example.com',
      telefone: '(41) 98888-7777',
    },
  };

  const result = redactAuditoriaPayload(payload);

  assert.deepEqual(result, {
    cpf: '***8900',
    email: 'ma***@example.com',
    telefone: '***0000',
    endereco: '[REDACTED]',
    nested: {
      email: 'jo***@example.com',
      telefone: '***7777',
    },
  });
});
