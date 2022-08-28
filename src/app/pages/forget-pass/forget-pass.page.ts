import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.page.html',
  styleUrls: ['./forget-pass.page.scss'],
})
export class ForgetPassPage implements OnInit {

  usuario = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  onSubmit(formulario: NgForm){
    this.navCtrl.navigateForward('map');
  }

  exit(){
    this.navCtrl.navigateBack('login');
  }

}
