import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';
import { INominatedSurveyor } from '../interfaces/INominatedSurveyor';

const API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NominatedSurveyorService {

  constructor(private http: HttpClient) {}

  getAllNominatedSurveyors(): Observable<any> {
    return this.http.get<any[]>(`${API}/library/all-nominatedsurveyor`);
  }

  createNominatedSurveyor(surveyor: INominatedSurveyor): Observable<any> {
    return this.http.post<any>(`${API}/staff/add-nominatedsurveyor`, surveyor);
  }

  editNominatedSurveyor(surveyor: INominatedSurveyor): Observable<any> {
    return this.http.post<any>(`${API}/staff/edit-nominatedsurveyor`, surveyor);
  }

  deleteNominatedSurveyor(id: number): Observable<any> {
    return this.http.delete<any>(`${API}/staff/delete-nominatedsurveyor`, { params: { id }});
  }
}