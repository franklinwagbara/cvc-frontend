import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBatch } from 'src/app/admin/processing-plant/coq-application-form/data-entry-form/data-entry-form.component';
import { environment } from 'src/environments/environment';
import { IMeter } from '../interfaces/IMeter';

const API = `${environment.apiUrl}/meter`;

@Injectable({
  providedIn: 'root',
})
export class MeterService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<any>(`${API}/all-meters`);
  }

  public createMeter(model: IMeter) {
    return this.http.post<any>(`${API}/add-meter`, model);
  }

  public deleteMeter(id: number) {
    return this.http.delete<any>(`${API}/delete-meter`, { params: { id } });
  }

  public getMeterByPlantId(plantId: number) {
    return this.http.get<any>(`${API}/meters-by-plantId`, {
      params: { plantId },
    });
  }

  public updateMeter(model: IMeter) {
    return this.http.post<any>(`${API}/update-meter`, model);
  }
}
