import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from '../../../environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../components/map-modal/map-modal.component';
import { LocationService } from '../../services/location.service';


@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;
  lat: number;
  lng: number;

  constructor(
    private modalCtrl: ModalController,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.fetchLocation();
  }

  ionViewDidEnter() {
    this.createMap();
  }
  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      config: {
        center: {
          lat: this.lat,
          lng: this.lng,
        },
        zoom: 8,
      },
    });
    this.addMarker();
  }

  async fetchLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    this.locationService.geocode(this.lat,this.lng).subscribe(async (result) => {
      this.navModal(result);
    });
  }

  async addMarker() {
    const markers: Marker[] = [
      {
        coordinate: {
          lat: this.lat,
          lng: this.lng,
        },
        title: 'Estás aquí',
      },
    ];
    await this.map.addMarkers(markers);
    // this.map.setOnMarkerClickListener(async (marker) => {
    //   this.navModal(marker);
    // });
  }
  async navModal(address: any) {
    const modal = await this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        address
      },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      mode: 'ios',
    });
    modal.present();
  }
}
