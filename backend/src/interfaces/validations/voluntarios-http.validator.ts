import type { ParsedQs } from 'qs';

import type { AtualizarVoluntarioDto } from '../../application/voluntarios/dtos/atualizar-voluntario.dto';
import type { CriarVoluntarioDto } from '../../application/voluntarios/dtos/criar-voluntario.dto';
import type { InativarVoluntarioDto } from '../../application/voluntarios/dtos/inativar-voluntario.dto';
import type { ListarVoluntariosDto } from '../../application/voluntarios/dtos/listar-voluntarios.dto';
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

export const validateUpdateVoluntario = (body: unknown): AtualizarVoluntarioDto => {
  const payload = ensureBodyObject(body);

  if ('cpf' in payload) {
    throw new ValidationError(validationDetail, [
      { field: 'cpf', message: 'CPF não pode ser alterado nesta operação.' }
    ]);
  }

  return {
    nomeCompleto: ensureString(payload.nomeCompleto, 'nomeCompleto'),
    dataNascimento: ensureIsoDate(payload.dataNascimento, 'dataNascimento'),
    email: ensureString(payload.email, 'email'),
    telefone: ensureString(payload.telefone, 'telefone'),
    endereco: ensureString(payload.endereco, 'endereco'),
    dataEntrada: ensureIsoDate(payload.dataEntrada, 'dataEntrada')
  };
};

export const validateInativarVoluntario = (body: unknown): InativarVoluntarioDto => {
  const payload = ensureBodyObject(body);

  return {
    dataSaida: ensureIsoDate(payload.dataSaida, 'dataSaida')
  };
};

export const parseListarVoluntariosQuery = (query: ParsedQs): ListarVoluntariosDto => {
  const nome = query.nome;
  const ativo = query.ativo;

  if (nome !== undefined && typeof nome !== 'string') {
    throw new ValidationError(validationDetail, [
      { field: 'nome', message: 'Filtro nome deve ser uma string.' }
    ]);
  }

  if (ativo === undefined) {
    return nome?.trim() ? { nome: nome.trim() } : {};
  }

  if (typeof ativo !== 'string' || !['true', 'false'].includes(ativo)) {
    throw new ValidationError(validationDetail, [
      { field: 'ativo', message: 'Filtro ativo deve ser true ou false.' }
    ]);
  }

  return {
    ...(nome?.trim() ? { nome: nome.trim() } : {}),
    ativo: ativo === 'true'
  };
};

export const parseRequiredId = (value: unknown): string => ensureString(value, 'id');
