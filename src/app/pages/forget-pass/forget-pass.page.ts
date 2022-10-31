import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.page.html',
  styleUrls: ['./forget-pass.page.scss'],
})
export class ForgetPassPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertCtrl: AlertController
  ) {}

  get email() {
    return this.credentials.get('email');
  }
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    const { email } = this.credentials.value;
    const alert = await this.alertCtrl.create({
      header: 'Su solicitud se ha realizado con éxito',
      message: 'Se le enviará un email con los pasos a seguir',
      buttons: ['OK'],
    });
    await alert.present();
    this.authService
      .forgetPassword(email)
      .then(() => this.router.navigate(['/login']));
  }
}
