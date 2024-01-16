import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';

const api = `${environment.apiUrl}/licenses`;

@Injectable({
  providedIn: 'root',
})
export class LicenceService {
  constructor(private http: HttpClient) {}

  public getLicences() {
    return this.http.get<any>(`${api}/all_permits`);
  }

  public getCompanyLicences() {
    return this.http.get<any>(`${api}/all_company_permits`);
  }

  public getLicence(id: number) {
    return this.http.get<any>(`${api}/view_license`, { params: { id } });
  }

  public viewCertificate(id: number) {
    return this.http.get<any>(`${api}/view_license?id=${id}`, {
      responseType: 'arraybuffer' as 'json',
    });
  }
}
