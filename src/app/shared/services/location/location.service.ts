import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
