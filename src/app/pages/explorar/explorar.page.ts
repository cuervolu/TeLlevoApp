import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  LoadingController,
  IonSearchbar,
  ToastController,
} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { Marker } from '@capacitor/google-maps';

import {
  LocationService,
  ApirutasService,
  DataService,
  UserService,
} from '../../services';
import { Sede, ContratoRuta, UserProfile } from '../../models';
import { mergeMap, startWith, takeWhile } from 'rxjs/operators';
import { interval, of } from 'rxjs';
import { IsNotDrivingComponent } from '../../components/is-not-driving/is-not-driving.component';

interface LatLng {
  lat: number;
  lng: number;
}
interface WayPoint {
  location: {
    lat: number;
    lng: number;
  };
  stopover: boolean;
}

declare let google;

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('autocomplete') autocomplete: IonSearchbar;
  @ViewChild(IonModal) modal: IonModal;

  //Latitud y Longitud de Duoc UC: Sede Puente Alto
  lat: any = -33.59767508016667;
  lng: any = -70.57894225397776;
  sedes: Sede[] = [];

  query = '';

  googleAutoComplete = new google.maps.places.AutocompleteService();
  searchResults = new Array<any>();

  destiny: string;

  //Directions
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  originArray: any[] = [];
  origin: any;
  destination: any;
  enableTracker = true;
  destinationMarker: Marker;

  isDriving = false;
  ruta: ContratoRuta;
  rutaId: string;
  wayPoints: WayPoint[] = [];

  perfil: UserProfile;

  constructor(
    private locationService: LocationService,
    private apiRutas: ApirutasService,
    private dataService: DataService,
    private userService: UserService,
    private rutas: ApirutasService,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private router: Router,
    private alertCtrl: AlertController,
    private ngZone: NgZone,
    private toastCtrl: ToastController
  ) {
    // this.listRoutes();
  }

  ngOnInit() {
    this.trackUserLocation();
    this.loadMap();
    this.userService
      .getUserProfile()
      .subscribe((data) => (this.perfil = data as UserProfile));
  }

  ionViewDidEnter() {
    this.modal.present();
  }

  ionViewDidLeave() {
    this.enableTracker = false;
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

    //Cargar indicadores
    const indicatorsElement: HTMLElement =
      document.getElementById('indicators');
    //Cargar Mapa
    const mapElement: HTMLElement = document.getElementById('map');

    const map = new google.maps.Map(mapElement, {
      center: duocPalto,
      zoom: 18,
      mapTypeControl: false,
      streetViewControl: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      mapId: '9a411300f76cb602',
    });

    google.maps.event.addListenerOnce(map, 'idle', () => {
      console.log('Mapa Cargado');
      loading.dismiss();
    });

    //Botón para ubicar el mapa en la ubicación del usuario
    const panButton: HTMLElement = document.getElementById('locationButton');

    panButton.addEventListener('click', () => {
      this.panToCurrentLocation(map);
    });

    //Añade marcador en ubicación de Duoc UC: Puente Alto
    // this.addMarker(duocPalto, map, 'Duoc UC: Sede Puente Alto');
    this.getSedes(map);

    //Añade direcciones de ruta para el usuario
    this.directionsDisplay.setMap(map);
    this.directionsDisplay.setPanel(indicatorsElement);
  }

  getRutaId(e) {
    this.rutaId = e;
  }

  enEspera() {
    const enEspera = this.apiRutas.rutaEnEspera(false, this.rutaId);
    if (enEspera) {
      console.log(`Usuario en espera: EXITOSO`);
    } else {
      console.error(`Usuario en espera: FALLIDO`);
    }
  }

  iniciarEstadoRuta(rutaId: string) {
    const inicializar = this.rutas.iniciarRuta(rutaId, true);
    if (inicializar) {
      console.log(`Ruta inicializada`);
    } else {
      console.error(`Ruta no inicializada`);
    }
  }
  async onSelectPasajero(e) {
    this.ruta = e;
    const alert = await this.alertCtrl.create({
      header: 'Iniciar Viaje',
      message: `¿Estás seguro de que quieres iniciar el viaje con ${this.ruta.pasajero.firstName}?`,
      buttons: [
        {
          text: 'No, quiero volver atrás',
          role: 'cancel',
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: async () => {
            this.iniciarEstadoRuta(this.rutaId);
            this.enEspera();
            this.userService
              .getPassengerByUid(this.ruta.pasajero.uid)
              .subscribe((data) => {
                console.log(data);
              });
            const pasajeroWaypoint: WayPoint = {
              location: {
                lat: this.ruta.pasajero.waypoint.latitud,
                lng: this.ruta.pasajero.waypoint.longitud,
              },
              stopover: this.ruta.pasajero.waypoint.stopover,
            };
            this.wayPoints.push(pasajeroWaypoint);
            const originData = await this.geolocation.getCurrentPosition();
            //*Desestructurar originData para solo obtener la latitud y la longitud
            const origin = {
              lat: originData.coords.latitude,
              lng: originData.coords.longitude,
            };
            this.destiny = this.ruta.direccion;
            this.destination = JSON.stringify(this.ruta.destino);
            this.calculateRoute(origin, this.ruta.destino, this.wayPoints);
          },
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  }

  addMarker(position: any, map: any, label?: string) {
    const marker = new google.maps.Marker({
      position,
      label,
      map,
    });
  }

  watchPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;
          this.apiRutas.sendLocation(latitud, longitud);
        }
      );
    } else {
      this.presentAlert(
        '¡Ha ocurrido un error!',
        'Tu sistema no soporta la Geolocalización'
      );
    }
  }

  trackUserLocation() {
    interval(30000)
      .pipe(
        startWith(0),
        takeWhile(() => this.enableTracker),
        mergeMap(() => of(this.watchPosition()))
      )
      .subscribe();
  }

  async panToCurrentLocation(map: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          if(this.originArray.length !== 0 ){
            for(const mark of this.originArray){
              mark.setMap(null);
              this.originArray = [];
            }
          }
          const marker = new google.maps.Marker({
            position: pos,
            map,
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
          console.log(`Error en GeoLocation con código ${e.code}, Mensaje: ${e.message}` );
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

  getSedes(map: any) {
    this.dataService.getSedes().subscribe((res) => {
      this.sedes = res;
      for (const sede of this.sedes) {
        const marker = new google.maps.Marker({
          position: sede.coordenadas,
          label: `Duoc UC: ${sede.nombre}`,
          map,
          icon: '/assets/collagueicon.png',
        });
      }
    });
  }

  onSearch() {
    if (!this.query.trim().length) {
      return;
    }
    this.googleAutoComplete.getPlacePredictions(
      { input: this.query },
      (predictions) => {
        this.ngZone.run(() => {
          this.searchResults = predictions;
        });
      }
    );
  }

  calculateRoute(origin, destination, waypoints?) {
    this.directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      async (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
          this.modal.setCurrentBreakpoint(0.25);
          this.isDriving = true;
          this.userService.enRuta(true);
          this.presentToast(
            'Viaje iniciado exitosamente',
            'success',
            'checkmark-circle-outline'
          );
        } else {
          await this.presentToast('No se pudo mostrar la dirección', 'danger');
        }
      }
    );
  }

  async geocodeAddress(item: any) {
    this.destiny = item.description;
    //*Conseguir la data sobre la ubicación del usuario
    const originData = await this.geolocation.getCurrentPosition();
    //*Desestructurar originData para solo obtener la latitud y la longitud
    const origin = {
      lat: originData.coords.latitude,
      lng: originData.coords.longitude,
    };

    this.query = ''; //Limpia el buscador

    this.locationService
      .reverseGeocode(item.description)
      .subscribe(async (res) => {
        this.destination = res;
        this.calculateRoute(origin, this.destination, this.wayPoints);
        // this.createApiRoute(origin, item.description, this.destination);
        console.log('Origen: ' + origin);
        console.log(('Destino: ' + this.destination) as unknown as LatLng);
      });
  }

  async cancelRoute() {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar Viaje',
      message: '¿Estás seguro de que quieres cancelar el viaje?',
      buttons: [
        {
          text: 'No, seguir con el viaje',
          role: 'cancel',
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: () => {
            this.directionsDisplay.setDirections({ routes: [] });
            this.modal.setCurrentBreakpoint(0.25);
            this.isDriving = false;
            this.userService.enRuta(false);
            if(this.rutaId !== undefined){
              this.rutas.cancelarRuta(this.perfil, this.rutaId);
              this.rutas.iniciarRuta(this.rutaId, false);
            }
            this.wayPoints.splice(0);
            this.presentToast(
              'Viaje cancelado exitosamente',
              'success',
              'checkmark-circle-outline'
            );
          },
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  }

  async finalizarRuta(){
    const alert = await this.alertCtrl.create({
      header: 'Finalizar Viaje',
      message: '¿Estás seguro de que quieres finalizar el viaje?',
      buttons: [
        {
          text: 'No, seguir con el viaje',
          role: 'cancel',
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: () => {
            this.directionsDisplay.setDirections({ routes: [] });
            this.modal.setCurrentBreakpoint(0.25);
            this.isDriving = false;
            this.userService.enRuta(false);
            if(this.rutaId !== undefined){
              this.rutas.finalizarRuta(this.rutaId);
              this.rutas.iniciarRuta(this.rutaId, false);
            }
            this.wayPoints.splice(0);
            this.presentToast(
              'Viaje finalizado exitosamente',
              'success',
              'checkmark-circle-outline'
            );
          },
        },
      ],
      mode: 'ios',
    });

    await alert.present();
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

  //De no ingresar ningún valor para el color, se pondrá por defecto el color rojo
  async presentToast(message: string, color: string = 'danger', icon?: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top',
      color,
      icon,
      mode: 'ios',
    });
    await toast.present();
  }
}
