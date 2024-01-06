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

  viewCoQLicense(id): Observable<any> {
    return this.http.get<any>(`${API}/view_license`);
  }

  getCOQById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/coq_by_id/${id}`);
  }

  submit(id: number): Observable<any> {
    return this.http.post<any>(`${API}/submit`, null, { params: { id } });
  }

  getAllCoQCerts(appId: number): Observable<any> {
    return of([]);
  }

  getAllDebitNotes(appId: number): Observable<any> {
    return of([]);
  }

  getDebitNoteById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/debit-note/${id}`);
  }

  createGasProductCoq(payload: any): Observable<any> {
    return this.http.post<any>(`${API}/coq/add-coq-gas-tank`, payload);
  }

  getCoqRequirement(appId: number, depotId: number): Observable<any> {
    return this.http.get<any>(`${API}/coq_requirement/${appId}`, { params: { depotId }});
  }

  processApplication(model: {
    applicationId: number;
    action: string;
    comment: string;
  }) {
    return this.http.post<any>(`${API}/process`, model, {
      params: {
        id: model.applicationId,
        act: model.action,
        comment: model.comment,
      },
    });
  }
}
