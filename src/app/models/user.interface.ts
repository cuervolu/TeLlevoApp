export interface Vehicle{
  marca?: string;
  anio?: number;
  modelo?: string;
}
export interface UserProfile {
  uid: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  esChofer?: boolean;
  precio?: number;
  sede?: string;
  vehiculo?: Vehicle;
}
