import { AppException } from './AppException';

export class NotFoundException extends AppException {
  public override message: string;
  constructor(message?: string) {
    super(message);
    this.message = message ? message : 'This resource was not found!';
  }
}
