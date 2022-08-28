import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';

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
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  onSubmit(formulario: NgForm) {
    this.navCtrl.navigateForward('login');
  }

  onLogin(){
    this.navCtrl.navigateBack('login');
  }
}
