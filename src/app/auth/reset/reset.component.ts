import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

const checkPasswords: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password').value;
  const confirmPassword = group.get('confirmPassword').value;

  return password === confirmPassword ? null : { notEqual: true };
};

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  credentials: FormGroup;
  oobCode: string = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.menuCtrl.enable(false);
    this.credentials = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],
      },
      { validators: checkPasswords }
    );
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    if(!this.oobCode){
      this.router.navigate(['login']);
    }
  }

  get password() {
    return this.credentials.get('password');
  }
  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }


  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  async onSubmit() {
    if(this.credentials.valid && this.oobCode){
      const loading = await this.loadingCtrl.create({
        spinner: 'circles',
        mode: 'ios',
      });
      await loading.present();
      const { password } = this.credentials.value;
      const reset = this.authService.resetPassword(password,this.oobCode);
      await loading.dismiss();
      if(reset){
        this.router.navigateByUrl('/tabs/home');
      }else{
        this.showAlert();
      }
    }
  }

  async showAlert(){
    const alert = await this.alertCtrl.create({
      header: '¡Ha ocurrido un error!',
      message: 'No se ha podido cumplir tu solicitud',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
