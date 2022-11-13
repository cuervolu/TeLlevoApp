export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  coordenadas?: SedeLatLng;
}


export interface SedeLatLng{
  lat: number;
  lng: number;
}
