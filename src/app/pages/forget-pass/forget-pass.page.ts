import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
    private menuCtrl: MenuController,
  ) {}

  get email() {
    return this.credentials.get('email');
  }
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async onSubmit(){
    const {email} = this.credentials.value;
    this.authService.resetPassword(email).then(() => this.router.navigate(['/']));
  }
}
