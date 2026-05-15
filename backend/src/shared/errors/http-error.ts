import { AppError } from './app-error';

type HttpErrorInput = {
  status: number;
  title: string;
  detail: string;
  type: string;
};

export class HttpError extends AppError {
  constructor({ status, title, detail, type }: HttpErrorInput) {
    super({ status, title, detail, type });
  }
}
