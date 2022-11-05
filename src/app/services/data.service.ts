import { Injectable } from '@angular/core';
import { Sede } from '../models';
import { Observable } from 'rxjs';
import { collection, doc } from 'firebase/firestore';
import { collectionData, Firestore, docData } from '@angular/fire/firestore';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  carDataMakeUrl = 'https://car-data.p.rapidapi.com/cars/makes';
  carDataYearUrl = 'https://car-data.p.rapidapi.com/cars/years';
  carDataModelUrl =
    'https://car-data.p.rapidapi.com/cars?limit=30&page=0&make=';

  httpOptions = {
    headers: new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Key': '1aac54e691mshd17b6b25551beebp15fb9cjsn6155962fd847',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Host': 'car-data.p.rapidapi.com',
    }),
  };

  constructor(private firestore: Firestore, private http: HttpClient) {}

  getSedes(): Observable<Sede[]> {
    const sedeRef = collection(this.firestore, 'sede');
    return collectionData(sedeRef, { idField: 'id' }) as Observable<Sede[]>;
  }

  getSedePorId(id): Observable<Sede[]> {
    const sedeDocRef = doc(this.firestore, `sede/${id}`);
    return docData(sedeDocRef, { idField: 'id' }) as Observable<Sede[]>;
  }

  getMake(): Observable<any> {
    return this.http.get(this.carDataMakeUrl, this.httpOptions);
  }

  getYear(): Observable<any> {
    return this.http.get(this.carDataYearUrl, this.httpOptions);
  }
  getModel(make: string, year: number): Observable<any> {
    return this.http.get(
      this.carDataModelUrl + make + '&year=' + year,
      this.httpOptions
    );
  }

}
