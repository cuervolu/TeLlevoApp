import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare let google;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  httpOptions = {
    headers: new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'applications/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Access-Control-Allow-Origin': '*',
    }),
  };

  searchPlaceUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';

  constructor(private http: HttpClient) {}

  geocode(latitude: number, longitude: number): Observable<any> {
    return new Observable<any>((observer) => {
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(latitude, longitude);
      geocoder.geocode({ latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          observer.next(results[0].formatted_address);
        } else {
          observer.error(status);
        }
        observer.complete();
      });
    });
  }


}
