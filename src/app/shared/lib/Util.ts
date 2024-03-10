import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { saveAs } from 'file-saver';
import * as html2pdf from 'html2pdf.js';
import { WritingOptions, write as writeBook, utils as xlsxUtils } from 'xlsx';

export class Util {

  public static adminRoles = ['SuperAdmin'];

  public static isPDF(filePath: string) {
    if (!filePath) return false;

    const fileType = filePath.split('.').slice(-1)[0].toLowerCase();

    return fileType === 'pdf';
  }

  public static isIMG(filePath) {
    if (!filePath) return false;
    const imageTypes = ['png', 'jpg', 'jpeg', 'tiff'];

    const fileType = filePath.split('.').slice(-1)[0].toLowerCase();

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

  public static hasProperties(obj: any, properties: any[]) {
    return properties.every(prop => prop in obj);
  }

  public static scrollToTop(): void {
    if (document.documentElement) {
      document.documentElement.scroll({behavior: 'smooth', top: 0});
    } else {
      document.body.scroll({behavior: 'smooth', top: 0})
    }
  }

  public static exportTable(
    format: 'csv' | 'excel' | 'pdf', 
    tableId: string, 
    filename?: string
  ) {
    const table = document.querySelector(`#${tableId}`);
    const rows = document.querySelectorAll(`#${tableId} tr`);

    if (format === 'pdf') {
      let opt = {
        margin:       1,
        filename:     filename || 'data.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      saveAs(
        new Blob([html2pdf(table, opt)], { type: "application/pdf" }),
        filename || 'data.pdf'
      )
    } else if (format === "csv") {
      let csv = []
      for (const row of Array.from(rows)) {
        const cells = row.querySelectorAll("td, th")
        const rowText = Array.from(cells).map(cell => (cell as HTMLElement).innerText)
        csv.push(rowText.join(","))
      }
      const csvFile = new Blob([csv.join("\n")], {
        type: "text/csv;charset=utf-8;",
      })
      saveAs(csvFile, filename || "data.csv")
    } else if (format === "excel") {
      const workbook = xlsxUtils.table_to_book(table)
      const options: WritingOptions = { bookType: "xlsx", bookSST: false, type: "array" }
      const output = writeBook(workbook, options)
      saveAs(
        new Blob([output], { type: "application/octet-stream" }),
        filename || "data.xlsx"
      )
    } else {
      throw new Error("Unsupported format")
    }
  }

  public static printHtml(elementId: string) {
    const printContents = document.querySelector(`#${elementId}`);
    const windowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=1000,height=1000,toolbar=0,scrollbars=0,status=0'
    );
    windowPrt.document.write(printContents.innerHTML);
    windowPrt.document.close();
    windowPrt.focus();
    windowPrt.print();
    windowPrt.close();
  }
}