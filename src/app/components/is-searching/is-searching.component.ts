import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { UserService } from 'src/app/services/users.service';
import { UserProfile } from 'src/app/models';
import { DriverProfileComponent } from '../driver-profile/driver-profile.component';
import { ContratoRuta } from '../../models/ruta.interface';
import { ApirutasService } from 'src/app/services';

@Component({
  selector: 'app-is-searching',
  templateUrl: './is-searching.component.html',
  styleUrls: ['./is-searching.component.scss'],
})
export class IsSearchingComponent implements OnInit {
  profile = null;
  loading = false;
  drivers: UserProfile[] = [];
  driver: UserProfile = null;
  choferData: UserProfile;
  rutaId: string;
  ruta: ContratoRuta;
  noDrivers = false;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private rutas: ApirutasService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.getDrivers();
      this.loading = false;
    });
  }

  getDrivers() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.userService
        .getChoferBySede(this.profile.sede, this.profile.uid)
        .subscribe((res) => {
          this.drivers = res;
          this.drivers = this.drivers.sort((a, b) => a.precio - b.precio);
          if (!this.drivers.length) {
            this.noDrivers = true;
          } else {
            this.noDrivers = false;
          }
          this.loading = false;
        });
    });
  }

  saveChoferInLS(chofer: UserProfile) {
    localStorage.setItem('chofer', JSON.stringify(chofer));
  }

  getRutaId(e) {
    this.rutaId = e;
    this.choferData = JSON.parse(localStorage.getItem('chofer'));
    this.rutas.getRutas(this.choferData, this.rutaId).subscribe((data) => {
      this.ruta = data as ContratoRuta;
    });
  }

  async onSelectDriver(uid: string) {
    const modal = await this.modalCtrl.create({
      component: DriverProfileComponent,
      mode: 'ios',
      componentProps: {
        uid,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.userService.enEspera(true);
      this.driver = data;
      this.saveChoferInLS(this.driver);
    }
  }
}
