import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  async mostrarLogin(){
    const modal = await this.modalCtrl.create({
      component: LoginPage
    });
    await modal.present();

    const resp = await modal.onDidDismiss();
  }
}
