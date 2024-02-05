import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBatch } from 'src/app/admin/processing-plant/coq-application-form/data-entry-form/data-entry-form.component';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/batch`;

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<any>(`${API}/all-batch`);
  }

  public createBatch(model: IBatch) {
    return this.http.post<any>(`${API}/add-batch`, model);
  }

  public deleteBatch(id: number) {
    return this.http.delete<any>(`${API}/delete-batch`, { params: { id } });
  }

  public updateBatch(model: IBatch) {
    return this.http.post<any>(`${API}/update-batch`, model);
  }
}
