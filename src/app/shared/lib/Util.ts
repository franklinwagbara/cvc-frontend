
export class Util {

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
}