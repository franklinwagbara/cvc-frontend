export class AppException extends Error {
  public override message: string;
  constructor(message?: string) {
    super(message);
    this.message = message ? message : 'Something went wrong.';
  }
}
