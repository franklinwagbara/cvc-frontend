import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/vesseldischargeclearance`;

@Injectable({
  providedIn: 'root'
})
export class DischargeClearanceService {

  constructor(
    private http: HttpClient
  ) { }

  createVesselDischargeClearance(data: any): Observable<any> {
    return this.http.post<any>(`${API}/create-vessel-discharge-clearance`, data);
  }

  getVesselDischargeClearance(id: number): Observable<any> {
    return this.http.get<any>(`${API}/vessel-discharge-clearance/${id}`);
  }
}
