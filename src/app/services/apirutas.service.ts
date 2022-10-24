/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApirutasService {

  rutas = 'http://cuervolu.pythonanywhere.com/api/rutas/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getRutas(): Observable<any>{
    return this.http.get(this.rutas).pipe(retry(3));
  }

  createRutas(route): Observable<any>{
    return this.http.post(this.rutas,JSON.stringify(route),this.httpOptions).pipe(retry(3));
  }
}
