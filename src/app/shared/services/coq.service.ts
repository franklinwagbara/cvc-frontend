import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
import { ICoQApplication } from '../interfaces/ICoQApplication';
import { Observable, of } from 'rxjs';

const API = `${environment.apiUrl}/CoQ`;

@Injectable({
  providedIn: 'root',
})
export class CoqService {
  constructor(private http: HttpClient) {}

  // getListOfRequiredDocs(): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(`${API}/`)
  // }

  getAllCOQs(): Observable<any> {
    return this.http.get<any>(`${API}/all_coqs`);
  }

  createCoQ(data: ICoQApplication): Observable<any> {
    return this.http.post<any>(`${API}/createCoQ`, data);
  }

  viewCoqApplication(id: number): Observable<any> {
    return this.http.get<any>(`${API}/coq_details/${id}`);
  }

  viewPPCoqApplication(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/ProcessingPlantCOQ/coq_details/${id}`
    );
  }

  viewCoQLicense(id): Observable<any> {
    return this.http.get<any>(`${API}/view_license`);
  }

  viewCoQCert(id: number): Observable<any> {
    return this.http.get<any>(`${API}/view_CoQ_cert`, { params: { id } });
  }

  getCOQById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/coq_by_id/${id}`);
  }

  submit(id: number): Observable<any> {
    return this.http.post<any>(`${API}/submit`, null, { params: { id } });
  }

  getAllCoQCerts(): Observable<any> {
    return this.http.get<any>(`${API}/all-coq-cert`);
  }

  getDebitNoteById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/debit-note/${id}`);
  }

  getCoqsByAppId(id: number): Observable<any> {
    return this.http.get<any>(`${API}/coq_by_appId/${id}`);
  }

  getCoqCerts(id: number): Observable<any> {
    return this.http.get<any>(`${API}/get-coq-certs/${id}`);
  }

  createGasProductCoq(payload: any): Observable<any> {
    return this.http.post<any>(`${API}/create-coq-gas`, payload);
  }

  createLiqProductCoq(payload: any): Observable<any> {
    return this.http.post<any>(`${API}/create-coq-liquid`, payload);
  }

  getCoqRequirement(appId: number, depotId: number): Observable<any> {
    if (!appId) {
      return this.http.get<any>(`${API}/coq_requirement/${depotId}`);
    }
    return this.http.get<any>(`${API}/coq_requirement/${depotId}`, {
      params: { appId },
    });
  }

  processApplication(
    model: {
      applicationId: number;
      action: string;
      comment: string;
    },
    isPPCOQ?: boolean
  ) {
    if (!isPPCOQ)
      return this.http.post<any>(`${API}/process`, model, {
        params: {
          id: model.applicationId,
          act: model.action,
          comment: model.comment,
        },
      });
    else
      return this.http.post<any>(
        `${environment.apiUrl}/ProcessingPlantCOQ/process`,
        model,
        {
          params: {
            id: model.applicationId,
            act: model.action,
            comment: model.comment,
          },
        }
      );
  }
}
