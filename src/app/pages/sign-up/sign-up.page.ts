import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/users.service';
import { switchMap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private menuCtrl: MenuController,
    private userService: UserService,
    private toastCtrl: ToastController
  ) {}

  get email() {
    return this.credentials.get('email');
  }
  get username() {
    return this.credentials.get('username');
  }
  get password() {
    return this.credentials.get('password');
  }
  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }
  get firstName() {
    return this.credentials.get('firstName');
  }
  get terminos() {
    return this.credentials.get('terminos');
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async signup() {
    const { email, password } = this.credentials.value;
    if (!this.credentials || !password || !email) {
      return;
    }
    const loading = await this.loadingCtrl.create({
      spinner: 'circles',
      mode: 'ios',
    });
    await loading.present();
    const { username, firstName } = this.credentials.value;
    const user = this.authService
      .signup(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userService.addUser({
            uid,
            email,
            firstName,
            username,
          })
        )
      )
      .subscribe(() => {
        if (user) {
          this.router.navigate(['/tabs/home']);
        } else {
          this.showAlert(
            '¡Ha ocurrido un error',
            'Por favor, inténtelo de nuevo'
          );
        }
      });
    await loading.dismiss();
    if (!user) {
      this.showAlert('¡Ha ocurrido un error', 'Por favor, inténtelo de nuevo');
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
