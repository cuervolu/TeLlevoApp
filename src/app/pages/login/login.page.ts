import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';


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
  constructor(private modalCtrl: ModalController, private navCtrl: NavController) {}

  ngOnInit() {}

  exit() {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateBack('inicio');
  }
  onSubmit(formulario: NgForm){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward('map');
  }

  onSignUp(){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward('sign-up');
  }

  onForgetPass(){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward('forget-pass');
  }
}
