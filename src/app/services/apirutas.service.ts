/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

import { AuthService } from '../auth/auth.service';
import { Chofer, ContratoRuta, Latlng, Pasajero, Ubicacion } from '../models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ApirutasService {
  rutas = 'http://cuervolu.pythonanywhere.com/api/rutas/';
  ubicacion = 'http://cuervolu.pythonanywhere.com/api/ubicacion/';
  locationId: number;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  choferLocation: Ubicacion[] = [];

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private authService: AuthService
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
  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.ubicacion);
  }

  sendLocation(latitud: number, longitud: number) {
    const user = this.auth.currentUser;
    this.getUbicaciones()
      .pipe(map((res) => res.filter((response) => response.uid === user.uid)))
      .subscribe((value) => {
        if (value.length > 0) {
          value.map((data) => {
            console.log(' %c Iniciando método PUT', 'color: green; font-weight: bold; background-color: black;');
            console.log('UID: ' + data.uid + ' ID: ' + data.id);
            return this.putUbicacion(
              data.id,
              user.uid,
              latitud,
              longitud
            ).subscribe((response) => {
              console.log(response);
            });
          });
        } else {
          console.log(' %c Iniciando método POST', 'color: red; font-weight: bold; background-color: black;');
          const data: Ubicacion = {
            ubicacion: [{ latitud, longitud }],
            uid: user.uid,
          };
          return this.http
            .post<any>(this.ubicacion, data, this.httpOptions)
            .subscribe((res) => {
              console.log(res);
            });
        }
      });
  }

  putUbicacion(id: number, uid: string, latitud: number, longitud: number) {
    const data: Ubicacion = {
      ubicacion: [{ latitud, longitud }],
      uid,
    };
    return this.http.put<Ubicacion[]>(
      this.ubicacion + id + '/',
      data,
      this.httpOptions
    );
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
