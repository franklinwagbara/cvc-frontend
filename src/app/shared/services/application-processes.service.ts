import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IApplicationProcess } from '../interfaces/IApplicationProcess';

const API = `${environment.apiUrl}/applicationProcesses`;

@Injectable({
  providedIn: 'root',
})
export class ApplicationProcessesService {
  constructor(private http: HttpClient) {}

  createApplicationProcess(model: IApplicationProcess) {
    return this.http.post<any>(`${API}/add-flow`, model);
  }

  getApplicationProcesses() {
    return this.http.get<any>(`${API}/get-processes`);
  }

  deleteApplicationProcess(id: number) {
    return this.http.delete<any>(`${API}/delete-flow/${id}`);
  }

  editApplicationProcess(flow: IApplicationProcess) {
    return this.http.post<any>(`${API}/edit-flow`, flow);
  }
}
