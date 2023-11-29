import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/AppStageDocuments`;

@Injectable({
  providedIn: 'root',
})
export class AppStageDocumentService {
  constructor(private http: HttpClient) {}

  getAllDocs() {
    return this.http.get<any>(`${API}/GetAll`);
  }

  getAllELPSDocs() {
    return this.http.get<any>(`${API}/get-elps-docs`);
  }

  deleteFacilityTypeDoc(id: number) {
    return this.http.delete(`${API}/Delete-FacilityType-Doc?id=${id}`);
  }

  addDoc(model: any) {
    return this.http.post<any>(`${API}/add-document`, model);
  }
}
