import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeterType } from 'src/app/admin/processing-plant/coq-application-form/coq-application-pp-form.component';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/MeterType`;

@Injectable({
  providedIn: 'root',
})
export class MeterTypeService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<any>(`${API}/get-all-meterTypes`);
  }

  public postMeterType(model: IMeterType) {
    return this.http.post<any>(`${API}/add-meterTypes`, model);
  }

  public deleteMeterType(id: any) {
    return this.http.delete<any>(`${API}/delete-meterTypes`, {
      params: { id },
    });
  }

  public updateMeterType(model: IMeterType) {
    return this.http.put<any>(`${API}/edit-meterTypes`, model, {
      params: { id: model.id },
    });
  }
}
