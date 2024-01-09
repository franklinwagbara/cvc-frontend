import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

const API = `${environment.apiUrl}/plant`

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private http: HttpClient) {}

  getAllPlants(): Observable<any> {
    return this.http.get<any>(`${API}/get-all-plants`);
  }

  getAllDepotsList(): Observable<any> {
    return this.http.get<any>(`${API}/get-all-depots-list`);
  }

  getAllPlantsByCompany(): Observable<any> {
    return this.http.get<any>(`${API}/get-all-plantsbycompany`);
  }

}
