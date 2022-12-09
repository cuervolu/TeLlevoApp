import { Component, OnInit, ViewChild } from '@angular/core';
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
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { UserService, DataService } from '../../services';
import { switchMap } from 'rxjs/operators';


const checkPasswords: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password').value;
  const confirmPassword = group.get('confirmPassword').value;

  return password === confirmPassword ? null : { notEqual: true };
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  @ViewChild('signupSlider') signupSlider: any;

  sedes = [];
  sedeSeleccionada: string;
  credentials: FormGroup;

  public slideOneForm: FormGroup;

  public slideTwoForm: FormGroup;

  public slideThreeForm: FormGroup;

  public submitAttempt = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: DataService,
    private toastCtrl: ToastController,
  ) { }

  get email() {
    return this.slideOneForm.get('email');
  }
  get username() {
    return this.slideOneForm.get('username');
  }
  get password() {
    return this.slideThreeForm.get('password');
  }
  get confirmPassword() {
    return this.slideThreeForm.get('confirmPassword');
  }
  get firstName() {
    return this.slideTwoForm.get('firstName');
  }
  get lastName() {
    return this.slideTwoForm.get('lastName');
  }
  get sede() {
    return this.slideTwoForm.get('sede');
  }

  ngOnInit() {
    this.getSedes();
    this.slideOneForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-z0-9_-]{4,16}$'),
        ],
      ],
    });
    this.slideTwoForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      sede: ['', [Validators.required]],
    });
    this.slideThreeForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['',[Validators.required, Validators.minLength(6)]],
      },
      { validators: checkPasswords }
    );
  }
  next() {
    this.signupSlider.slideNext();
  }

  prev() {
    this.signupSlider.slidePrev();
  }
  async signup() {
    const { email } = this.slideOneForm.value;
    const { password } = this.slideThreeForm.value;

    //Si los campos no son correctos, se enviará al slide con los datos no válidos y mostrara un Toast
    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
      this.mostrarToast('Debes rellenar todos los campos del formulario');
      return;
    } else if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
      this.mostrarToast('Debes rellenar todos los campos del formulario');
      return;
    } else if (!this.slideThreeForm.valid) {
      this.signupSlider.slideTo(2);
      this.mostrarToast('Debes rellenar todos los campos del formulario');
      return;
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'circles',
      cssClass: 'custom-loading',
      mode: 'ios',
    });

    await loading.present();

    const { firstName, lastName, sede } = this.slideTwoForm.value;

    const { username } = this.slideOneForm.value;

    //Se registra al usuario y a la vez se añade a la database de Firebase
    const user = this.authService
      .signup(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userService.addUser({
            uid,
            email,
            firstName,
            lastName,
            username,
            sede,
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
      }, (e) => {
        console.error('Error: ' + e);
      });

    await loading.dismiss();

    //De haber algún error en Firebase, se mostrara está alerta
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

  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      color: 'danger',
      duration: 1500,
      position: 'bottom',
      mode: 'ios',
    });

    await toast.present();
  }

  getSedes() {
    this.dataService.getSedes().subscribe((res) => {
      this.sedes = res;
    });
  }
}
