import type { CriarVoluntarioDto } from '../../application/voluntarios/dtos/criar-voluntario.dto';
import type { FiltrarVoluntariosDto } from '../../application/voluntarios/dtos/filtrar-voluntarios.dto';
import { ValidationError } from '../../shared/errors/validation-error';

const validationDetail = 'Um ou mais campos enviados são inválidos.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const ensureIsoDate = (value: unknown, field: string): string => {
  const text = ensureString(value, field);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(`${text}T00:00:00.000Z`))) {
    throw new ValidationError(validationDetail, [
      { field, message: 'Data deve estar no formato YYYY-MM-DD.' }
    ]);
  }

  return text;
};

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

const ensureBodyObject = (body: unknown): Record<string, unknown> => {
  if (!isRecord(body)) {
    throw new ValidationError(validationDetail, [
      { field: 'body', message: 'O corpo da requisição deve ser um objeto JSON válido.' }
    ]);
  }

  return body;
};

export const parseVoluntarioFilters = (query: Record<string, unknown>): FiltrarVoluntariosDto => {
  const filters: FiltrarVoluntariosDto = {};

  if (typeof query.nome === 'string' && query.nome.trim()) {
    filters.nome = query.nome.trim();
  }

  if (typeof query.cpf === 'string' && query.cpf.trim()) {
    filters.cpf = query.cpf.replace(/\D/g, '');
  }

  if (typeof query.email === 'string' && query.email.trim()) {
    filters.email = query.email.trim().toLowerCase();
  }

  if (query.ativo === 'true') {
    filters.ativo = true;
  } else if (query.ativo === 'false') {
    filters.ativo = false;
  }

  return filters;
};

export const validateCreateVoluntario = (body: unknown): CriarVoluntarioDto => {
  const payload = ensureBodyObject(body);

  return {
    nomeCompleto: ensureString(payload.nomeCompleto, 'nomeCompleto'),
    cpf: ensureString(payload.cpf, 'cpf'),
    dataNascimento: ensureIsoDate(payload.dataNascimento, 'dataNascimento'),
    email: ensureString(payload.email, 'email'),
    telefone: ensureString(payload.telefone, 'telefone'),
    endereco: ensureString(payload.endereco, 'endereco'),
    dataEntrada: ensureIsoDate(payload.dataEntrada, 'dataEntrada')
  };
};
