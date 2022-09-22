import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

declare let google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  geocode(latitude: number, longitude: number): Observable<any>{
    return new Observable<any>(observer => {
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(latitude,longitude);
      geocoder.geocode({latLng}, (results, status) => {
        if(status === google.maps.GeocoderStatus.OK){
          observer.next(results[0].formatted_address);
        }else{
          observer.error(status);
        }
        observer.complete();
      });
    });
  }
}
