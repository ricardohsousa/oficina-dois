import { AppError, type AppErrorField } from './app-error';

export class ValidationError extends AppError {
  constructor(
    detail = 'Um ou mais campos enviados são inválidos.',
    errors?: AppErrorField[]
  ) {
    super({
      type: 'https://ellp.local/errors/validation-error',
      title: 'Erro de validação',
      status: 400,
      detail,
      errors
    });
  }
}
