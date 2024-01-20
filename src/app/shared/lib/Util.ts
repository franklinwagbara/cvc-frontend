import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class Util {

  public static adminRoles = ['Admin', 'SuperAdmin'];

  public static isPDF(filePath: string) {
    if (!filePath) return false;

    const fileType = filePath.split('.').slice(-1)[0];

    return fileType == 'pdf';
  }

  public static isIMG(filePath) {
    if (!filePath) return false;
    const imageTypes = ['png', 'jpg', 'jpeg', 'tiff'];

    const fileType = filePath.split('.').slice(-1)[0];

    return imageTypes.includes(fileType);
  }

  public static onlyEitherExists(obj1: any, obj2: any): boolean {
    if ((!obj1 && !obj2) || (Object.keys(obj1).length && Object.keys(obj2).length)) return false;
    return !!(Object.keys(obj1).length || Object.keys(obj2).length);
  }

  public static objNotEmpty(obj: any): boolean {
    return !obj ? false : Object.keys(obj).length > 0;
  }

  public static customValidator(evaluatorFn: Function, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !evaluatorFn(control.value) ? { [errorKey]: { value: control.value } } : null;
    }
  }

  public static blockSpecialNonNumerics(evt: KeyboardEvent): void {
    if (
      ['e', 'E', '+', '-'].includes(evt.key) &&
      (evt.target as HTMLElement).tagName.toLowerCase() === 'input' &&
      (evt.target as HTMLInputElement).type !== 'text'
    ) {
      evt.preventDefault();
    }
  }
}