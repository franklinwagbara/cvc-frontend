import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const api = `${environment.apiUrl}/jettyofficer`;

@Injectable({
  providedIn: 'root',
})
export class JettyOfficerService {
  constructor(private http: HttpClient) {}

  public getAllMappings() {
    return this.http.get<any>(`${api}/get-all-mappings`);
  }

  public createMapping(model: any) {
    return this.http.post<any>(`${api}/add-mapping`, model);
  }
}
