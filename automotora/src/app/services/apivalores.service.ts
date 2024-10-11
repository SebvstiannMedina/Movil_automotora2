import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApivaloresService {

  private apiUrl = 'https://mindicador.cl/api';

  constructor(private http: HttpClient) { }

  // Método para obtener los valores del dólar y el euro
  getValores(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}