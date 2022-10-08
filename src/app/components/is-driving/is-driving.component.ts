import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare let google;

@Component({
  selector: 'app-is-driving',
  templateUrl: './is-driving.component.html',
  styleUrls: ['./is-driving.component.scss'],
})
export class IsDrivingComponent implements OnInit {
  @Input() destiny: string;
  @Input() latlng: string;
  @Output() cancelEvent = new EventEmitter<any>();

  directionsDisplay = new google.maps.DirectionsRenderer();

  constructor() { }

  ngOnInit() {}

}
