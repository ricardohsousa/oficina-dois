import type { AtualizarOficinaDto } from '../../application/oficinas/dtos/atualizar-oficina.dto';
import type { CriarOficinaDto } from '../../application/oficinas/dtos/criar-oficina.dto';
import { ValidationError } from '../../shared/errors/validation-error';

const validationDetail = 'Um ou mais campos enviados são inválidos.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const ensureString = (value: unknown, field: string): string => {
  if (typeof value !== 'string') {
    throw new ValidationError(validationDetail, [{ field, message: 'Campo obrigatório.' }]);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new ValidationError(validationDetail, [{ field, message: 'Campo obrigatório.' }]);
  }

  return normalized;
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

const ensureBodyObject = (body: unknown): Record<string, unknown> => {
  if (!isRecord(body)) {
    throw new ValidationError(validationDetail, [
      { field: 'body', message: 'O corpo da requisição deve ser um objeto JSON válido.' },
    ]);
  }

  return body;
};

export const validateCreateOficina = (body: unknown): CriarOficinaDto => {
  const payload = ensureBodyObject(body);

  return {
    nome: ensureString(payload.nome, 'nome'),
    descricao: ensureString(payload.descricao, 'descricao'),
    dataInicio: ensureIsoDate(payload.dataInicio, 'dataInicio'),
    dataFim: ensureOptionalIsoDate(payload.dataFim, 'dataFim'),
  };
};

export const validateUpdateOficina = (body: unknown): AtualizarOficinaDto =>
  validateCreateOficina(body);
