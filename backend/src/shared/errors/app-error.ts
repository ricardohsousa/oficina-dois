export type AppErrorField = {
  field: string;
  message: string;
};

type AppErrorOptions = {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: AppErrorField[];
};

export class AppError extends Error {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly errors?: AppErrorField[];

  constructor(options: AppErrorOptions) {
    super(options.detail);

    this.name = new.target.name;
    this.type = options.type;
    this.title = options.title;
    this.status = options.status;
    this.detail = options.detail;
    this.errors = options.errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
