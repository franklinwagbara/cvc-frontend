import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApplicationFormDTO } from '../interfaces/IApplicationFormDTO';

const API = `${environment.apiUrl}/shiptoship`;

@Injectable({
  providedIn: 'root'
})
export class ShipToShipService {

  constructor(private http: HttpClient) { }

  public getAllRecords(): Observable<any> {
    return this.http.get<any>(`${API}/get-all-records`);
  }

  public addRecord(payload: IApplicationFormDTO): Observable<any> {
    return this.http.post<IApplicationFormDTO>(`${API}/add-records`, payload);
  }
}
