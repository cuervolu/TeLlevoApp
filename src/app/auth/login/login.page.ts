import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { FormBuilder, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario = {
    email: '',
    password: '',
  };
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {}

  exit() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/inicio');
  }

  async onSubmit(formulario: NgForm) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const user = await this.authService.login(
      this.usuario.email,
      this.usuario.password
    );
    await loading.dismiss();
    if (user) {
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Ha ocurrido un error', 'Por favor, inténtelo de nuevo');
    }
  }

  onSignUp() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/sign-up');
  }

  onForgetPass() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('forget-pass');
  }

  async showAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok'],
    });
    await alert.present();
  }
}
