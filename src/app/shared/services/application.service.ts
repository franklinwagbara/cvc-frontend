import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IApplicationFormDTO } from '../interfaces/IApplicationFormDTO';

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

  // viewApplicationByDepot(depotId: number): Observable<any> {
  //   return this.http.get<any>(`${API}/view-application-by-depot`, {
  //     params: { id: depotId },
  //   });
  // }

  viewApplicationByDepot(): Observable<any> {
    return this.http.get<any>(`${API}/view-application-By-Depot-Officer`, {});
  }

  viewApplicationByJetty(): Observable<any> {
    return this.http.get<any>(`${API}/view-application-By-Jetty-Officer`, {});
  }

  viewApplicationByDepotOfficer(officerId: number): Observable<any> {
    return this.http.get<any>(`${API}/view-application-by-depot-officer`, {
      params: { id: officerId },
    });
  }

  public getVesselDetails(appId: number, depotId: number) {
    return this.http.get<any>(`${API}/get-app-vessel-info`, {
      params: { id: appId, depotId },
    });
  }

  public getVesselByImoNumber(imoNumber: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/Vessel/verify-IMO-numbers?imoNumber=${imoNumber}`
    );
  }
}
