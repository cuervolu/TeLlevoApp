import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  @ViewChild('map')mapRef: ElementRef;
  map: GoogleMap;

  constructor() {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.createMap();
  }
  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      config:{
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      },
    });
    this.addMarkers();
  }

  async addMarkers(){}
}
