import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IApplicationFormDTO } from 'src/app/company/apply/new-application/new-application.component';
import { Observable } from 'rxjs';

const API = `${environment.apiUrl}/application`;

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  public verifyLicence(licenceNo: string) {
    return this.http.get<any>(`${API}/verify-license`, {
      params: { license: licenceNo },
    });
  }

  public apply(payload: IApplicationFormDTO) {
    return this.http.post<any>(`${API}/apply`, payload);
  }

  getApplicationsOnDesk() {
    return this.http.get<any>(`${API}/my-desk`);
  }

  public getUploadDocuments(appId: number) {
    return this.http.get<any>(`${API}/get-documents`, {
      params: { id: appId },
    });
  }

  viewApplication(id: any) {
    return this.http.get<any>(`${API}/view-application`, {
      params: { id },
    });
  }

  getAllApplications() {
    return this.http.get<any>(`${API}/all-applications`);
  }

  viewApplicationByDepot(depotId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${API}/view-application-by-depot`, { params: { id: depotId }});
  }

  viewApplicationByDepotOfficer(officerId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${API}/view-application-by-depot-officer`, { params: { id: officerId }});
  }
}
