import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth';
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

  async forgetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  async resetPassword(password: string, oobCode: string) {
    try {
      const reset = await await confirmPasswordReset(
        this.auth,
        oobCode,
        password
      );
      return reset;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }
}
