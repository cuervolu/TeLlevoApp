import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { UserService } from '../services';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EsChoferGuard implements CanActivate {
  public isDriver: boolean;

  constructor(
    private userService: UserService,
    private navCtrl: NavController
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isUserADriver();
  }

  isUserADriver(): Observable<boolean> {
    return this.userService.getUserProfile().pipe(
      switchMap((data) => {
        this.isDriver = data.esChofer;
        if (!this.isDriver) {
          this.routeToPassengerPage();
        }
        return of(this.isDriver);
      })
    );
  }

  routeToPassengerPage(): boolean {
    this.navCtrl.navigateRoot('/tabs/passenger');
    return false;
  }
}
