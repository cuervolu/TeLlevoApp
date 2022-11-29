import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

import {
  UserService,
  LocationService,
  ApirutasService,
  DataService,
} from '../../services';
import {
  GoogleLatlng,
  Sede,
  UserProfile,
  Latlng,
  Pasajero,
} from 'src/app/models';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
})
export class DriverProfileComponent implements OnInit {
  uid: string;

  chofer: UserProfile = null;

  formattedAddress = null; //dirección destino
  direccionOrigen: string;

  loading = false;

  newPrecio: number;

  pasajero = null;

  origin: any;
  sede: Sede[];

  asientosDisponibles = 4;
  newAsientosDisponibles: number;

  coordenadas: GoogleLatlng;

  constructor(
    private auth: Auth,
    private userService: UserService,
    private rutas: ApirutasService,
    private locationService: LocationService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getChoferByUid(this.uid).subscribe((data) => {
      this.chofer = data;
      this.userService.getUserProfile().subscribe((res) => {
        this.pasajero = res;
      });
      this.getLatLngOfSede();
      this.getUserLocation();
      this.loading = false;
    });
  }

  confirm(chofer: any) {
    return this.modalCtrl.dismiss(chofer, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSelect(ev) {
    this.asientosDisponibles = this.asientosDisponibles;
    this.newAsientosDisponibles = this.asientosDisponibles - ev.target.value;

    this.chofer.precio = this.chofer.precio;
    this.newPrecio = this.chofer.precio * ev.target.value;
  }

  /*
    Esta función almacena dos datos, las coordenadas (latitud y longitud) en la variable origen y
    la dirección geocodificada inversamente.
  */
  async getUserLocation() {
    const originData = await this.geolocation.getCurrentPosition();
    this.origin = {
      lat: originData.coords.latitude,
      lng: originData.coords.longitude,
    };
    this.locationService
      .latLngToAddress(this.origin)
      .subscribe(async (data) => {
        this.direccionOrigen = data;
      });
  }

  enEspera() {
    const enEspera = this.userService.enEspera(true);
    if (enEspera) {
      console.log('Usuario en espera: EXITOSO');
    } else {
      console.error('Usuario en espera: FALLIDO');
    }
  }

  contratarChofer() {
    this.getLatLngOfSede();
    const choferSeleccionado: UserProfile = {
      uid: this.chofer.uid,
      email: this.chofer.email,
      username: this.chofer.username,
      firstName: this.chofer.firstName,
      lastName: this.chofer.lastName,
      sede: this.chofer.sede,
      vehiculo: this.chofer.vehiculo,
    };

    const pasajero: Pasajero = {
      uid: this.pasajero.uid,
      email: this.pasajero.email,
      username: this.pasajero.username,
      firstName: this.pasajero.firstName,
      sede: this.pasajero.sede,
      lastName: this.pasajero.lastName,
      waypoint: {
        latitud: this.origin.lat,
        longitud: this.origin.lng,
        stopover: true,
      },
    };

    this.rutas
      .hireDriver(
        choferSeleccionado,
        pasajero,
        this.newPrecio,
        this.origin,
        this.coordenadas as Latlng,
        this.direccionOrigen,
        this.formattedAddress
      )
      .then(
        () => {
          this.presentAlert('¡Éxito!', 'Se ha enviado el pedido exitosamente');
          this.enEspera();
          this.confirm(choferSeleccionado);
        },
        (e) => {
          this.presentAlert(
            'Ha ocurrido un error!',
            'No se ha podido contratar al chofer'
          );
          this.cancel();
          console.error(e);
        }
      );
  }

  getLatLngOfSede() {
    this.dataService.getSedes().subscribe((res) => {
      this.sede = res;
      const result = this.sede.filter((obj) => obj.nombre === this.chofer.sede);
      this.coordenadas = result[0].coordenadas;
      //Sede del usuario a Direccion formateada
      this.locationService
        .latLngToAddress(this.coordenadas)
        .subscribe(async (data) => {
          this.formattedAddress = data;
        });
    });
  }

  async contratar() {
    if (!this.newPrecio) {
      this.newPrecio = this.chofer.precio;
    }
    const alert = await this.alertCtrl.create({
      header: `¿Contratar a ${this.chofer.firstName} ${this.chofer.lastName}?`,
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
            this.contratarChofer();
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      mode: 'ios',
    });
    await alert.present();
  }
}
