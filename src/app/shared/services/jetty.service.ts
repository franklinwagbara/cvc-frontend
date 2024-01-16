import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

const API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class JettyService {

  constructor(private http: HttpClient) { }

  getAllJetty(): Observable<any> {
    return this.http.get<any>(`${API}/library/all-jetty`);
  }

  createJetty(jetty: { name: string }): Observable<any> {
    return this.http.post<any>(`${API}/location/create-jetty`, jetty);
  }

  editJetty(jetty: { name: string }): Observable<any> {
    return this.http.post<any>(`${API}/location/edit-jetty`, jetty);
  }

  deleteJetty(id: number): Observable<any> {
    return this.http.delete(`${API}/location/delete-jetty`, { params: { id }});
  }
}
