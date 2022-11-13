import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, AlertController } from '@ionic/angular';

import { UserProfile } from 'src/app/models';
import { UserService, LocationService } from '../../services';
import { Latlng, Pasajero, Chofer} from '../../models';



@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
})
export class DriverProfileComponent implements OnInit {

  uid;

  profile: UserProfile = null;

  formattedAddress = null;

  loading = false;

  newPrecio: number;

  pasajero: Pasajero = null;

  chofer: Chofer;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getChoferByUid(this.uid).subscribe((data) => {
      this.profile = data;
      this.loading = false;
    });
    this.getUserLocation();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSelect(ev) {
    this.profile.precio = this.profile.precio;
    this.newPrecio = this.profile.precio * ev.target.value;
  }

  /*
    Esta función almacena dos datos, las coordenadas (latitud y longitud) en la variable origen y
    la dirección geocodificada inversamente.
  */
  async getUserLocation() {
    const originData = await this.geolocation.getCurrentPosition();
    const origin = {
      latitud: originData.coords.latitude,
      longitud: originData.coords.longitude,
    };
    this.pasajero.waypoint = origin;
    console.log(this.pasajero.waypoint);
    this.locationService.latLngToAddress(origin).subscribe(async (res) => {
      this.formattedAddress = res;
    });
  }

  contratarChofer(origen: Latlng, direccion: string, uid: string ){

  }

  async contratar() {
    if (!this.newPrecio) {
      this.newPrecio = this.profile.precio;
    }
    const alert = await this.alertCtrl.create({
      header: `¿Contratar a ${this.profile.firstName} ${this.profile.lastName}?`,
      subHeader: `Valor: ${this.newPrecio.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
      })}`,
      message: `Dirección: ${this.formattedAddress}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Contratar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            console.log('Confirmado');
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
  }
}
