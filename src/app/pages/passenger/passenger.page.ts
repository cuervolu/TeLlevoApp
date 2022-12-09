import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ApirutasService, DataService, UserService } from '../../services';
import { Sede, UserProfile } from '../../models';
import { Ubicacion } from '../../models/ubicacion.interface';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { format } from 'date-fns';
declare let google;
@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  sedes: Sede[] = [];
  isModalOpen = false;
  profile = null;
  loading = false;
  drivers: UserProfile[] = [];
  //Latitud y Longitud de Duoc UC: Sede Puente Alto
  lat: any = -33.59767508016667;
  lng: any = -70.57894225397776;
  ubicaciones: Ubicacion[] = [];
  choferProfile: UserProfile;
  today = format(new Date(), 'dd-MM-yyyy');
  originArray: any[] = [];
  constructor(
    private userService: UserService,
    private dataService: DataService,
    private rutasService: ApirutasService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    console.log(this.today);
    this.loadMap();
    this.getDrivers();
  }

  ionViewDidEnter() {
    this.modal.present();
  }

  ionViewDidLeave() {
    this.modal.dismiss();
  }

  async loadMap() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
      spinner: 'circles',
      cssClass: 'custom-loading',
      mode: 'ios',
    });
    loading.present();
    //Carga ubicación de Duoc UC: Puente Alto
    const duocPalto = {
      lat: this.lat,
      lng: this.lng,
    };

    //Cargar Mapa
    const mapElement: HTMLElement = document.getElementById('mapP');

    const passengerMap = new google.maps.Map(mapElement, {
      center: duocPalto,
      zoom: 18,
      mapTypeControl: false,
      streetViewControl: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      mapId: '9a411300f76cb602',
    });
    this.getChoferLocation(passengerMap);
    google.maps.event.addListenerOnce(passengerMap, 'idle', () => {
      console.log('Mapa Cargado');
      loading.dismiss();
    });

    //Botón para ubicar el mapa en la ubicación del usuario
    const panButton: HTMLElement = document.getElementById('locationButton');

    panButton.addEventListener('click', () => {
      this.panToCurrentLocation(passengerMap);
    });

    this.getSedes(passengerMap);
  }

  getDrivers() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.userService
        .getChoferBySede(this.profile.sede, this.profile.uid)
        .subscribe((res) => {
          this.drivers = res;
          this.loading = false;
        });
    });
  }

  getSedes(passengerMap: any) {
    this.dataService.getSedes().subscribe((res) => {
      this.sedes = res;
      for (const sede of this.sedes) {
        const marker = new google.maps.Marker({
          position: sede.coordenadas,
          label: `Duoc UC: ${sede.nombre}`,
          map: passengerMap,
          icon: '/assets/collagueicon.png',
        });
      }
    });
  }
  getChoferLocation(passengerMap: any) {
    const user = this.auth.currentUser;
    this.rutasService
      .getUbicaciones()
      .pipe(
        map((res) =>
          res.filter(
            (response) =>
              response.uid !== user.uid && response.fecha === this.today
          )
        )
      )
      .subscribe((data) => {
        this.ubicaciones = data;
        for (const chofer of this.ubicaciones) {
          const uid = chofer.uid;
          this.userService.getChoferByUid(uid).subscribe((res) => {
            this.choferProfile = res;
            for (const ubicacion of chofer.ubicacion) {
              const position = {
                lat: ubicacion.latitud,
                lng: ubicacion.longitud,
              };
              const marker = new google.maps.Marker({
                position,
                label: {
                  text: this.choferProfile.username,
                  color: '#cd0c36',
                  fontSize: '30px',
                  fontWeight: 'bold',
                },
                map: passengerMap,
                icon: '/assets/usericon.png',
              });
            }
          });
        }
      });
  }

  addMarker(position: any, passengerMap: any, label?: string) {
    const marker = new google.maps.Marker({
      position,
      label,
      passengerMap,
    });
  }

  async panToCurrentLocation(passengerMap: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          passengerMap.setCenter(pos);

          if (this.originArray.length !== 0) {
            for (const mark of this.originArray) {
              mark.setMap(null);
              this.originArray = [];
            }
          }

          const marker = new google.maps.Marker({
            position: pos,
            passengerMap,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillOpacity: 1,
              strokeWeight: 2,
              fillColor: '#5384ED',
              strokeColor: '#ffffff',
            },
          });
          this.originArray.push(marker);
        },
        (e) => {
          console.log(e);
          this.presentAlert(
            '¡Ha ocurrido un error!',
            'Vuelve a intentarlo más tarde'
          );
        }
      );
    } else {
      // !El navegador no es compatible con la geolocalización
      await this.presentAlert(
        '¡Ha ocurrido un error!',
        'Tu sistema no soporta la Geolocalización'
      );
    }
  }

  redirectTo(name: string) {
    this.modal.dismiss();
    this.router.navigateByUrl(`/tabs/${name}`);
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
