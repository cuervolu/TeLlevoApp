import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, Auth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  const user = {
    email: 'an.cuervo@duocuc.cl',
    password: '12345678',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('Debe bloquear el login si la contraseña es incorrecta', async () => {
    const login = await service.login(user);
    expect(login).toBeNull();
  });

  it('No debe crear un usuario si el email ya existe', () => {
    const signup = service.signup(user.email, user.password).subscribe((res) => {
      expect(res).toBeNull();
    });
  });
});
