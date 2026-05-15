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
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
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
            instance: typeof input === 'string' ? input : input.toString()
          }
    );
  }

  return payload as T;
}
