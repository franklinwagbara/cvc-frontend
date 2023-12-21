import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDepot } from 'src/app/company/apply/new-application/new-application.component';
import { environment } from 'src/environments/environment';

const api = `${environment.apiUrl}/location`;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  public getAppDepots() {
    return this.http.get<any>(`${api}/all-depot`);
  }

  public deleteAppDepot(id: any) {
    return this.http.delete<any>(`${api}/delete-depot`, { params: { id } });
  }

  public getDepot(id: any) {
    return this.http.get<any>(`${api}/get-depot-by-id`, { params: { id } });
  }

  public createDepot(model: IDepot) {
    return this.http.post<any>(`${api}/create-depot`, model);
  }

  public editDepot(model: IDepot) {
    return this.http.post<any>(`${api}/create-depot`, model, {
      params: { id: model.id },
    });
  }
}
