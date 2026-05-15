import type { AssociarVoluntarioOficinaDto } from '../../application/atuacoes/dtos/associar-voluntario-oficina.dto';
import { ValidationError } from '../../shared/errors/validation-error';

const validationDetail = 'Um ou mais campos enviados são inválidos.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const ensureString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ValidationError(validationDetail, [{ field, message: 'Campo obrigatório.' }]);
  }

  return value.trim();
};

const ensureIsoDate = (value: unknown, field: string): string => {
  const text = ensureString(value, field);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(`${text}T00:00:00.000Z`))) {
    throw new ValidationError(validationDetail, [
      { field, message: 'Data deve estar no formato YYYY-MM-DD.' },
    ]);
  }

  return text;
};

const ensureOptionalIsoDate = (value: unknown, field: string): string | null => {
  if (value === undefined || value === null || value === '') return null;

  return ensureIsoDate(value, field);
};

const ensureOptionalPositiveInt = (value: unknown, field: string): number | null => {
  if (value === undefined || value === null) return null;

  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new ValidationError(validationDetail, [
      { field, message: 'Deve ser um número inteiro positivo.' },
    ]);
  }

  return value;
};

export const validateAssociarVoluntarioOficina = (
  body: unknown,
): AssociarVoluntarioOficinaDto => {
  if (!isRecord(body)) {
    throw new ValidationError(validationDetail, [
      { field: 'body', message: 'O corpo da requisição deve ser um objeto JSON válido.' },
    ]);
  }

  return {
    oficinaId: ensureString(body.oficinaId, 'oficinaId'),
    dataInicio: ensureIsoDate(body.dataInicio, 'dataInicio'),
    dataFim: ensureOptionalIsoDate(body.dataFim, 'dataFim'),
    cargaHoraria: ensureOptionalPositiveInt(body.cargaHoraria, 'cargaHoraria'),
  };
};
