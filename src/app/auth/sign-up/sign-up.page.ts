import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  usuario = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onSubmit(formulario: NgForm) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const user = await this.authService.signup(this.usuario.email,this.usuario.password);
    await loading.dismiss();
    if(user){
      this.router.navigateByUrl('/login',{replaceUrl: true});
    }else{
      this.showAlert('¡Ha ocurrido un error','Por favor, inténtelo de nuevo');
    }
  }

  onLogin() {
    this.router.navigateByUrl('/login');
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
