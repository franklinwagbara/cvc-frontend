import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const api = `${environment.apiUrl}/library`;

@Injectable({
  providedIn: 'root',
})
export class LibaryService {
  constructor(private http: HttpClient) {}

  getStaffsForNomination() {
    return this.http.get<any>(`${api}/all-usersFO`);
  }

  public getFacilityTypes() {
    return this.http.get<any>(`${api}/facilitytypes`);
  }

  public getVesselTypes() {
    return this.http.get<any>(`${api}/vesseltype`);
  }

  getAllFacilityTypeDocs() {
    return this.http.get<any>(`${api}/GetAll-Facility-Type-Doc`);
  }

  public getApplicationTypes() {
    return this.http.get<any>(`${api}/applicationTypes`);
  }

  public getLGAByStateId(id: number) {
    return this.http.get<any>(`${api}/LgaByStateId`, {
      params: { stateId: id },
    });
  }

  public getLGA() {
    return this.http.get<any>(`${api}/Lga`);
  }

  public getStates() {
    return this.http.get<any>(`${api}/states`);
  }

  public getProducts() {
    return this.http.get<any>(`${api}/getProducts`);
  }

  public getRoles() {
    return this.http.get<any>(`${api}/Roles`);
  }

  public getAppActions() {
    return this.http.get<any>(`${api}/getAllAppActions`);
  }

  public getAppStatuses() {
    return this.http.get<any>(`${api}/getAppStatus`);
  }
}
