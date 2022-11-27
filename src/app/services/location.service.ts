import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

declare let google;
interface LatLng {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  currentPosition: LatLng;

  constructor() {}

  reverseGeocode(address: string): Observable<any> {
    return new Observable<any>((observer) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address,
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            observer.next(results[0].geometry.location);
            observer.complete();
          } else {
            console.error(
              'Geocode no tuvo éxito por la siguiente razón: ' + status
            );
          }
        }
      );
    });
  }

  currentLocation(): Observable<any> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          return pos;
        },
        (e) => {
          console.log(e);
          return null;
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.error('Browser doesnt support Geolocation');
      return null;
    }
  }

  latLngToAddress(location: { lat: number; lng: number }): Observable<any> {
    return new Observable<any>((observer) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location,
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            observer.next(results[0].formatted_address);
            observer.complete();
          } else {
            console.log(
              'Geocode no tuvo éxito por la siguiente razón: ' + status
            );
          }
        }
      );
    });
  }
}
