import { Vehicle } from './user.interface';

//Información dirigido a Firebase
export interface ContratoRuta {
  chofer: Chofer;
  pasajero: Pasajero;
  precio?: number;
}

export interface Chofer {
  uid: string;
  vehiculo?: Vehicle;
}

export interface Pasajero {
  uid?: string;
  waypoint: Waypoint;
}

//Información proveniente de Google Maps
export interface InfoRuta {
  origen?: Latlng;
  destino?: Latlng;
  pasajero?: Pasajero[];
  chofer?: Chofer;
  direccion?: string;
}

export interface Latlng {
  latitud?: number;
  longitud?: number;
}

export interface Waypoint {
  latitud: number;
  longitud: number;
  stopover?: boolean;
}
