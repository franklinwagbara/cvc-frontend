import { AppException } from './AppException';

export class UnexpectedException extends AppException {
  public override message: string;
  constructor(message?: string) {
    super(message);
    this.message = message ? message : 'An unexpected error occurred.';
  }
}
