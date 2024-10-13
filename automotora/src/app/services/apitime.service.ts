import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApitimeService {

  private apiUrl = 'https://worldtimeapi.org/api/timezone/America/Santiago';

  constructor(private http: HttpClient) { }

  getChiletime() {
    return this.http.get(`${this.apiUrl}`);
  }

}
