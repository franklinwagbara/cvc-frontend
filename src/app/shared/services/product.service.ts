import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = `${environment.apiUrl}/product`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${API}/all-products`);
  }

  getAllProductTypes(): Observable<any> {
    return this.http.get<any>(`${API}/all-product-types`);
  }
}
