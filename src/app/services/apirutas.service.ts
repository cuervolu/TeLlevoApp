/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import {
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

import {
  Chofer,
  ContratoRuta,
  Latlng,
  Pasajero,
  Ubicacion,
  UserProfile,
} from '../models';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ApirutasService {
  ubicacion = 'https://cuervolu.pythonanywhere.com/api/ubicacion/';
  locationId: number;
  rutaId: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  choferLocation: Ubicacion[] = [];

  today = format(new Date(), 'dd-MM-yyyy');

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private firestore: Firestore,
    private alertCtrl: AlertController
  ) {}

  getRutas(chofer: UserProfile, rutaId: string) {
    const userDocRef = doc(
      this.firestore,
      `rutas/${chofer.uid}/viajes/${rutaId}`
    );
    return docData(userDocRef);
  }
  saveRutaIDInLS(id: any) {
    localStorage.setItem('ruta', id);
  }

  getRutasOfChofer(): Observable<any> {
    const user = this.auth.currentUser;
    const refD = collection(this.firestore, `rutas/${user.uid}/viajes/`);
    const queryUsers = query(refD, where('cancelada', '==', false),where('enEspera', '==', true));
    return collectionData(queryUsers) as Observable<ContratoRuta[]>;
  }

  async getCurrentRutaOfChofer(pasajeroUid: string): Promise<string> {
    const user = this.auth.currentUser;
    const refD = collection(this.firestore, `rutas/${user.uid}/viajes/`);
    const queryUsers = query(
      refD,
      where('enEspera', '==', true),
      where('cancelada', '==', false),
      where('pasajero.uid', '==', pasajeroUid)
    );
    const querySnapshot = await getDocs(queryUsers);
    querySnapshot.forEach((data) => (this.rutaId = data.id));
    return this.rutaId;
  }

  async hireDriver(
    chofer: Chofer,
    pasajero: Pasajero,
    precio: number,
    origen: Latlng,
    destino: Latlng,
    direccionOrigen: string,
    direccion: string
  ) {
    const contratoRuta: ContratoRuta = {
      chofer,
      pasajero,
      precio,
      origen,
      destino,
      direccionOrigen,
      direccion,
      fecha: this.today,
      cancelada: false,
      finalizada: false,
      iniciada: false,
      enEspera: true,
    };
    const ref = collection(this.firestore, 'rutas', `${chofer.uid}/viajes/`);
    const docRef = await addDoc(ref, { ...contratoRuta });
    this.saveRutaIDInLS(docRef.id);
    return docRef;
  }

  async cancelarRuta(chofer: UserProfile, rutaId: string) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, `rutas/${user.uid}/viajes/${rutaId}`);
    try {
      await from(updateDoc(refD, { cancelada: true }));
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async iniciarRuta(rutaId: string, iniciar: boolean) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, `rutas/${user.uid}/viajes/${rutaId}`);
    try {
      await from(updateDoc(refD, { iniciada: iniciar }));
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async finalizarRuta(rutaId: string){
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, `rutas/${user.uid}/viajes/${rutaId}`);
    try {
      await from(updateDoc(refD, { finalizada: true }));
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async rutaEnEspera(enEspera: boolean,rutaId: string) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, `rutas/${user.uid}/viajes/${rutaId}`);
    try {
      await from(updateDoc(refD, { enEspera }));
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  getUbicaciones(): Observable<Ubicacion[]> {
    const user = this.auth.currentUser;
    return this.http.get<Ubicacion[]>(this.ubicacion);
  }

  sendLocation(latitud: number, longitud: number) {
    const user = this.auth.currentUser;
    this.getUbicaciones()
      .pipe(map((res) => res.filter((response) => response.uid === user.uid)))
      .subscribe((value) => {
        if (value.length > 0) {
          value.map((data) => {
            console.log(
              ' %c Iniciando método PUT',
              'color: green; font-weight: bold; background-color: black;'
            );
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
          console.log(
            ' %c Iniciando método POST',
            'color: red; font-weight: bold; background-color: black;'
          );
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
