import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);
  constructor(private auth: Auth) {}

  signup(email: string, password: string) {
    try {
      const user = from(
        createUserWithEmailAndPassword(this.auth, email, password)
      );
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async resetPassword(email: string){
    return await sendPasswordResetEmail(this.auth,email);
  }

  logout() {
    return signOut(this.auth);
  }
}
