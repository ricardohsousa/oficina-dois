import assert from 'node:assert/strict';
import test from 'node:test';

import { redactAuditoriaPayload } from '../../src/application/auditoria/services/redact-auditoria-payload';

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
