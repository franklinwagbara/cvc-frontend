import { AppException } from './AppException';

export class ConflictException extends AppException {
  public override message: string;
  constructor(message?: string) {
    super(message);
    this.message = message ? message : 'This resource already exist.';
  }
}
