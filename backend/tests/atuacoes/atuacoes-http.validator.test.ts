import assert from 'node:assert/strict';
import test from 'node:test';

import { validateAssociarVoluntarioOficina } from '../../src/interfaces/validations/atuacoes-http.validator';
import { ValidationError } from '../../src/shared/errors/validation-error';

test('validateAssociarVoluntarioOficina lança ValidationError quando body é null', () => {
  assert.throws(
    () => validateAssociarVoluntarioOficina(null),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando body é um array', () => {
  assert.throws(
    () => validateAssociarVoluntarioOficina([]),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando officinaId está ausente', () => {
  assert.throws(
    () => validateAssociarVoluntarioOficina({ dataInicio: '2026-03-01' }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando dataInicio está ausente', () => {
  assert.throws(
    () => validateAssociarVoluntarioOficina({ oficinaId: 'ofic-1' }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando dataInicio tem formato inválido', () => {
  assert.throws(
    () => validateAssociarVoluntarioOficina({ oficinaId: 'ofic-1', dataInicio: '01/03/2026' }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando cargaHoraria é negativa', () => {
  assert.throws(
    () =>
      validateAssociarVoluntarioOficina({
        oficinaId: 'ofic-1',
        dataInicio: '2026-03-01',
        cargaHoraria: -5,
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando cargaHoraria é decimal', () => {
  assert.throws(
    () =>
      validateAssociarVoluntarioOficina({
        oficinaId: 'ofic-1',
        dataInicio: '2026-03-01',
        cargaHoraria: 1.5,
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando dataFim tem formato inválido', () => {
  assert.throws(
    () =>
      validateAssociarVoluntarioOficina({
        oficinaId: 'ofic-1',
        dataInicio: '2026-03-01',
        dataFim: '01/06/2026',
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina lança ValidationError quando cargaHoraria é zero', () => {
  assert.throws(
    () =>
      validateAssociarVoluntarioOficina({
        oficinaId: 'ofic-1',
        dataInicio: '2026-03-01',
        cargaHoraria: 0,
      }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.equal(err.status, 400);
      return true;
    },
  );
});

test('validateAssociarVoluntarioOficina retorna null para dataFim vazia', () => {
  const result = validateAssociarVoluntarioOficina({
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
    dataFim: '',
  });

  assert.equal(result.dataFim, null);
});

test('validateAssociarVoluntarioOficina retorna null para cargaHoraria ausente', () => {
  const result = validateAssociarVoluntarioOficina({
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
  });

  assert.equal(result.cargaHoraria, null);
});

test('validateAssociarVoluntarioOficina retorna DTO válido com campos obrigatórios', () => {
  const result = validateAssociarVoluntarioOficina({
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
  });

  assert.equal(result.oficinaId, 'ofic-1');
  assert.equal(result.dataInicio, '2026-03-01');
  assert.equal(result.dataFim, null);
  assert.equal(result.cargaHoraria, null);
});

test('validateAssociarVoluntarioOficina retorna DTO válido com todos os campos', () => {
  const result = validateAssociarVoluntarioOficina({
    oficinaId: 'ofic-1',
    dataInicio: '2026-03-01',
    dataFim: '2026-06-30',
    cargaHoraria: 40,
  });

  assert.equal(result.oficinaId, 'ofic-1');
  assert.equal(result.dataInicio, '2026-03-01');
  assert.equal(result.dataFim, '2026-06-30');
  assert.equal(result.cargaHoraria, 40);
});
