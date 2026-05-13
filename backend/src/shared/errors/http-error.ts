type HttpErrorInput = {
  status: number;
  title: string;
  detail: string;
  type: string;
};

export class HttpError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly type: string;

  constructor({ status, title, detail, type }: HttpErrorInput) {
    super(detail);
    this.name = 'HttpError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.type = type;
  }
}
