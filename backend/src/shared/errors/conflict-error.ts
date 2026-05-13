import { AppError } from './app-error';

export class ConflictError extends AppError {
  constructor(detail = 'O recurso informado entra em conflito com um registro existente.') {
    super({
      type: 'https://ellp.local/errors/conflict',
      title: 'Conflito de dados',
      status: 409,
      detail
    });
  }
}
