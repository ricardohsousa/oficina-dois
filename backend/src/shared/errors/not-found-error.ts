import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(detail = 'O recurso solicitado não foi encontrado.') {
    super({
      type: 'https://ellp.local/errors/not-found',
      title: 'Recurso não encontrado',
      status: 404,
      detail
    });
  }
}
