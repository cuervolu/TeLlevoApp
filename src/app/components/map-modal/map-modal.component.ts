import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

declare let google;

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  @Input() address: any;
  @ViewChild('autocomplete') autocomplete: IonInput;
  constructor() { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.autocomplete.getInputElement().then((ref: any) => {
      const autocomplete = new google.maps.places.Autocomplete(ref);
      autocomplete.addListener('place_changed', () => {
        console.log(autocomplete.getPlace());
      });
    });
  }

}
