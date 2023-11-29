import { AppException } from './AppException';

export class BadRequestException extends AppException {
  public override message: string;
  constructor(message?: string) {
    super(message);
    this.message = message
      ? message
      : 'Bad request. Please check the data you are submitting to the server.';
  }
}
