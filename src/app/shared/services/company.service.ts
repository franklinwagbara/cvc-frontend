import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, map } from 'rxjs/operators';
import { environment } from '../../../../src/environments/environment';

const API = `${environment.apiUrl}/company`;
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private num = 2;

  constructor(private http: HttpClient) {}

  getCompanyApplications() {
    return this.http.get<any>(`${API}/my-apps`).pipe();
  }

  public getUploadDocuments(appId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/application/document-upload`,
      {
        params: { id: appId },
      }
    );
  }

  public saveCompanyProfile(data) {
    return this.http.post<any>(
      `${environment.apiUrl}/Company/update-profile`,
      data
    );
  }

  public getCompanyProfile(email) {
    return this.http.get<any>(`${environment.apiUrl}/Company/get-profile`, {
      params: { email: email },
    });
  }

  getCountries() {
    return this.http.get<any>(`${environment.apiUrl}/Library/Countries`).pipe(
      retry(this.num),
      map((res) => {
        return res;
      })
    );
  }

  getStates() {
    return this.http.get<any>(`${environment.apiUrl}/Library/states`).pipe(
      retry(this.num),
      map((res) => {
        return res;
      })
    );
  }

  public getCompanyDashboard() {
    return this.http.get<any>(`${API}/dashboard`);
  }

  public getCompanyMessages() {
    return this.http.get<any>(`${API}/get-all-message`);
  }
}
