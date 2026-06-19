export type ApiFieldError = {
  field: string;
  message: string;
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: ApiFieldError[];
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem?: ProblemDetails
  ) {
    super(problem?.detail ?? 'Não foi possível concluir a requisição.');
    this.name = 'ApiError';
  }
}

import { getAccessToken } from '@/lib/session';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '/api';

const buildUrl = (input: RequestInfo | URL) => {
  if (typeof input !== 'string') {
    return input;
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }

  return `${apiBaseUrl}${input}`;
};

const buildHeaders = (init?: RequestInit) => {
  const headers = new Headers(init?.headers ?? {});

  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const isProblemDetails = (value: unknown): value is ProblemDetails => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const problem = value as Record<string, unknown>;

  return (
    typeof problem.type === 'string' &&
    typeof problem.title === 'string' &&
    typeof problem.status === 'number' &&
    typeof problem.detail === 'string' &&
    typeof problem.instance === 'string'
  );
};

export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const url = buildUrl(input);
  const response = await fetch(url, {
    ...init,
    headers: buildHeaders(init)
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      isProblemDetails(payload)
        ? payload
        : {
            type: 'about:blank',
            title: 'Erro na requisição',
            status: response.status,
            detail: 'Não foi possível processar a resposta da API.',
            instance: typeof url === 'string' ? url : url.toString()
          }
    );
  }

  return payload as T;
}

export async function download(input: string, init?: RequestInit) {
  const response = await fetch(buildUrl(input), {
    ...init,
    headers: buildHeaders(init)
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    throw new ApiError(
      response.status,
      isProblemDetails(payload)
        ? payload
        : {
            type: 'about:blank',
            title: 'Erro na requisição',
            status: response.status,
            detail: 'Não foi possível baixar o arquivo solicitado.',
            instance: input
          }
    );
  }

  return response.blob();
}
