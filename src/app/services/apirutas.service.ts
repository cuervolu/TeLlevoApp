/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Chofer, ContratoRuta, Latlng, Pasajero, Vehicle } from '../models';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ApirutasService {
  rutas = 'http://cuervolu.pythonanywhere.com/api/rutas/';
  ubicacion = 'http://cuervolu.pythonanywhere.com/api/ubicacion/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private alertCtrl: AlertController
  ) {}

  getRutas(): Observable<any> {
    return this.http.get(this.rutas).pipe(retry(3));
  }

  createRutas(route): Observable<any> {
    return this.http
      .post(this.rutas, JSON.stringify(route), this.httpOptions)
      .pipe(retry(3));
  }

  hireDriver(pasajero: Pasajero, chofer: Chofer, precio: number) {
    const contratoRuta: ContratoRuta = {
      chofer,
      pasajero,
      precio,
    };
    const ref = doc(this.firestore, 'rutaContratada', chofer.uid);
    return from(setDoc(ref, { ...contratoRuta }));
  }

  sendLocation(position: Latlng) {
    console.log(position);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      mode: 'ios',
    });
    await alert.present();
  }
}
