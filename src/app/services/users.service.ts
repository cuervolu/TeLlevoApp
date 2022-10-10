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
import { UserProfile } from '../models/user.interface';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { deleteField, collection, query } from 'firebase/firestore';

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

  get allUsers$(): Observable<UserProfile[]>{
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
  addUser(user: UserProfile): Observable<any> {
    const refD = doc(this.firestore, 'users', user.uid);
    return from(setDoc(refD, user));
  }

  updateUser(user: UserProfile): Observable<any> {
    const refD = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(refD, { ...user }));
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
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

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
