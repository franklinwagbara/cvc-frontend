import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';

const api = `${environment.apiUrl}/depotofficer`;

@Injectable({
  providedIn: 'root',
})
export class DepotOfficerService {
  constructor(private http: HttpClient) {}

  public getAllMappings() {
    return this.http.get<any>(`${api}/get-all-mappings`);
  }

  public createMapping(model: any) {
    return this.http.post<any>(`${api}/add-mapping`, model);
  }

  public editMapping(model: any) {
    return this.http.post<any>(`${api}/edit-mapping/${model.depotId}`, model);
  }

  public deleteMapping(id: number) {
    return this.http.delete<any>(`${api}/delete-mapping`, { params: { id }});
  }
}
