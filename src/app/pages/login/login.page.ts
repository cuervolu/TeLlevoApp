import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private fb: FormBuilder
  ) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //Desactiva el menú en la página
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  //Activa el menú en la siguiente página
  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();
    if (user) {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } else {
      this.showAlert('Ha ocurrido un error', 'Por favor, inténtelo de nuevo');
    }
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
