import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Photo } from '@capacitor/camera';
import {
  collectionData,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { UserProfile, Vehicle } from '../models/user.interface';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { deleteField, collection, query, where } from 'firebase/firestore';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService
  ) {}

  get allUsers$(): Observable<UserProfile[]> {
    const refD = collection(this.firestore, 'users');
    const queryAll = query(refD);
    return collectionData(queryAll) as Observable<UserProfile[]>;
  }

  get currentUserProfile$(): Observable<UserProfile | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const refD = doc(this.firestore, 'users', user?.uid);
        return docData(refD) as Observable<UserProfile>;
      })
    );
  }

  getChoferBySede(sede: string, uid: string): Observable<any> {
    const refD = collection(this.firestore, 'users');
    const queryUsers = query(
      refD,
      where('sede', '==', sede),
      where('esChofer', '==', true),
      where('uid', '!=', uid)
    );
    return collectionData(queryUsers) as Observable<UserProfile[]>;
  }

  getChoferByUid(uid: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return docData(userDocRef);
  }
  getPassengerByUid(uid: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return docData(userDocRef);
  }

  addUser(user: UserProfile): Observable<any> {
    const refD = doc(this.firestore, 'users', user.uid);
    return from(setDoc(refD, user));
  }

  updateUser(user: UserProfile): Observable<any> {
    const refD = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(refD, { ...user }));
  }

  updateDriverVehicle(uid: string, vehicle: Vehicle): Observable<any> {
    const refD = doc(this.firestore, 'users', uid);
    return from(
      updateDoc(refD, {
        vehiculo: {
          marca: vehicle.marca,
          anio: vehicle.anio,
          modelo: vehicle.modelo,
        },
      })
    );
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef);
  }

  async esChofer(esChofer: boolean) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, 'users', user.uid);
    try {
      await from(updateDoc(refD, { esChofer }));
      this.precioViaje(1500);
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async enEspera(enEspera: boolean, userUid?: string) {
    if (userUid !== undefined) {
      const refD = doc(this.firestore, 'users', userUid);
      try {
        await from(updateDoc(refD, { enEspera }));
        return true;
      } catch (e) {
        console.error(e);
        return null;
      }
    } else {
      const user = this.auth.currentUser;
      const refD = doc(this.firestore, 'users', user.uid);
      try {
        await from(updateDoc(refD, { enEspera }));
        return true;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }

  async enRuta(enRuta: boolean) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, 'users', user.uid);
    try {
      await from(updateDoc(refD, { enRuta }));
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async precioViaje(precio: number) {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, 'users', user.uid);
    try {
      await from(updateDoc(refD, { precio }));
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deletePrecioViaje() {
    const user = this.auth.currentUser;
    const refD = doc(this.firestore, 'users', user.uid);
    try {
      await from(updateDoc(refD, { precio: deleteField() }));
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async uploadImage(cameraFile: ImageCroppedEvent) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.jpeg`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64.split(',')[1], 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);

      await from(updateDoc(userDocRef, { imageUrl }));
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteImage() {
    const user = this.auth.currentUser;
    const imageUrl = doc(this.firestore, `users/${user.uid}`);
    try {
      await updateDoc(imageUrl, { imageUrl: deleteField() });
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
