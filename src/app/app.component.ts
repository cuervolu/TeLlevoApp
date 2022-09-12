import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Componente } from './interfaces/interfaces';
import { DataService } from './services/data.service';
import { AuthService } from './auth/auth.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  componentes: Observable<Componente[]>;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();
    this.router.events.subscribe((event: RouterEvent) => {
      if (
        (event instanceof NavigationEnd && event.url === '/inicio') ||
        event.url === '/' ||
        event.url === '/sign-up' ||
        event.url === '/forget-pass' ||
        event.url === '/login'
      ) {
        this.menuCtrl.enable(false);
      } else {
        this.menuCtrl.enable(true);
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
