import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';

@Injectable({ providedIn: 'root' })
export class GenericService {
  account = 'account';
  company = 'company';
  companyinformation = 'companyinformation';
  home = 'home';
  admin = 'admin';
  authCode = 'dd20c4e0-be39-4f25-90ff-a5b92693e12b';
  sizePerPage: any;
  sizeten: any;
  state: string;
  address: string;
  category: string;
  lga: string;
  phase: string;
  upload: string;
  phaseShortName: string;

  constructor(private popUp: PopupService) {}

  public getExpDoc(value: string, type: string) {
    let ext;
    switch (type) {
      case 'application/pdf':
        ext = '.pdf';
        break;
      case 'text/plain':
        ext = '.txt';
        break;
      case 'application/msword':
        ext = '.doc';
        break;
      default:
        ext = value.slice(value.lastIndexOf('.'));
        break;
    }
    const reg = /[^A-Za-z0-9]/g;
    return (
      value.replace(reg, '').toLowerCase() +
      Math.floor(Math.random() * 100) +
      ext
    );
  }

  public isValidFile(file: File): boolean {
    let isAccepted = /(\.png|\.jpg|\.jpeg|\.pdf)$/i.test(file.name);
    if (!isAccepted) {
      this.popUp.open(`Invalid file format: (${file.name})`, 'error');
      return false;
    }

    const fileSizeInBytes = file.size;
    const fileSizeInKb = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKb / 1024;
    if (fileSizeInMB > 20) {
      this.popUp.open(`File ${file.name} size too large`, 'error');
      return false;
    }
    return true;
  }
}
