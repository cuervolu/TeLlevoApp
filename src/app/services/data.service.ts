import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';

import { Observable } from 'rxjs';
import { Sede } from '../models/sede.interface';
import { collection, doc } from 'firebase/firestore';
import { collectionData, Firestore, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private firestore: Firestore) { }

  getMenuOpts() {
    return this.http.get<Componente[]>('/assets/data/menu-opts.json');
  }

  getSedes(): Observable<Sede[]>{
    const sedeRef = collection(this.firestore, 'sede');
    return collectionData(sedeRef, {idField: 'id'}) as Observable<Sede[]>;
  }

  getSedePorId(id): Observable<Sede[]> {
    const sedeDocRef = doc(this.firestore, `sede/${id}`);
    return docData(sedeDocRef, { idField: 'id'}) as Observable<Sede[]>;
  }
}
