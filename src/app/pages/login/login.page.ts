import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  exit() {
    this.modalCtrl.dismiss();
  }
  onSubmit(formulario: NgForm){
    console.log(formulario.value);
  }
}
