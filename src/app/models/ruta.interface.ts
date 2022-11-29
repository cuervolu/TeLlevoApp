import { Vehicle } from './user.interface';

//Información dirigido a Firebase
export interface ContratoRuta {
  id?: string;
  chofer: Chofer;
  pasajero?: Pasajero;
  precio?: number;
  origen?: Latlng;
  destino?: Latlng;
  direccionOrigen?: string;
  direccion: string;
  fecha?: string;
  cancelada?: boolean;
  finalizada?: boolean;
  iniciada?: boolean;
  enEspera?: boolean;
}

export interface Chofer {
  uid: string;
  vehiculo?: Vehicle;
}

export interface Pasajero {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  sede: string;
  waypoint: Waypoint;
}
export interface Latlng {
  latitud?: number;
  longitud?: number;
}

export interface GoogleLatlng {
  lat: number;
  lng: number;
}

export interface Waypoint {
  latitud: number;
  longitud: number;
  stopover?: boolean;
}
