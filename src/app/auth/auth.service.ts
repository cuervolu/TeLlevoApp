import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth';
import { from } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);
  constructor(private auth: Auth, private toastCtrl: ToastController) {}

  signup(email: string, password: string) {
    try {
      const user = from(
        createUserWithEmailAndPassword(this.auth, email, password).catch(
          (e) => {
            if (e.code === 'auth/email-already-in-use') {
              this.presentToast('El email ya se encuentra en uso', 'danger');
              return null;
            }
          }
        )
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
      let msg: string;
      switch (e.code) {
        case 'auth/wrong-password':
          msg = 'Email o Contraseña incorrectos.';
          break;
        case 'auth/user-not-found':
          msg = 'Usuario no encontrado';
          break;
        case 'auth/invalid-email':
          msg = 'Email o Contraseña incorrectos.';
          break;
        case 'auth/too-many-requests':
          msg =
            'Has intentado demasiadas veces. Se bloqueará el acceso a la cuenta temporalmente';
          break;
      }
      this.presentToast(msg, 'danger');
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
