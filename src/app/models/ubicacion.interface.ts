export interface Ubicacion {
  id?: number;
  uid: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ubicacion: [{ latitud: number; longitud: number }];
  fecha?: string;
}
