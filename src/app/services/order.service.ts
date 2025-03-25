import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private endpoint:string;
  private apiUrlClient: string;
  private apiUrlProduct: string;
  private apiUrlOrder: string;

  // private ruta: string;


  constructor( private http: HttpClient) {

    this.endpoint = 'http://localhost:8000/api/';
    this.apiUrlClient = 'client';
    this.apiUrlProduct = 'product';
    this.apiUrlOrder = 'order';
    // this.ruta ='';
   }

   getClients(): Observable<any> {
    return this.http.get(`${this.endpoint}${this.apiUrlClient}`);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.endpoint}${this.apiUrlProduct}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.endpoint}${this.apiUrlOrder}`, orderData);
  }

}
