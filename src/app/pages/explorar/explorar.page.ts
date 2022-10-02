import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LocationService } from '../../services/location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
declare let google;

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild(IonModal) modal: IonModal;

  //Latitud y Longitud de Duoc UC: Sede Puente Alto
  lat: any = -33.59767508016667;
  lng: any = -70.57894225397776;

  query: string;
  //Directions
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  origin = { lat: -33.6080176, lng: -70.5809917 };

  destination = { lat: -33.6015076, lng: -70.5957617 };

  address: any;

  constructor(
    private locationService: LocationService,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMap();
  }

  ionViewDidEnter(){
    this.modal.present();
  }

  async loadMap() {
    //LoadingCtrl
    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
      spinner: 'circles',
      cssClass: 'custom-loading',
      mode: 'ios',
    });
    loading.present();

    //Conseguir ubicación del usuario
    const userLocation = await this.geolocation.getCurrentPosition();
    const duocPalto = {
      lat: this.lat,
      lng: this.lng,
    };

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

    this.addMarker(duocPalto, map, 'Duoc UC: Sede Puente Alto');

    const request = {
      query: this.query,
      fields: ['name', 'geometry'],
    };
  }

  onSearch(event) {
    this.query = event.detail.value;
    console.log(this.query);
  }

  addMarker(position: any, map: any, label?: string) {
    const marker = new google.maps.Marker({
      position,
      label,
      map,
    });
  }

  redirectTo(name: string){
    this.modal.dismiss();
    this.router.navigateByUrl(`/tabs/${name}`);
  }
}
