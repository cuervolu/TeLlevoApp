import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Componente } from './models/componente.interface';
import { DataService } from './services/data.service';
import { AuthService } from './auth/auth.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  componentes: Observable<Componente[]>;
  user$ = this.userService.currentUserProfile$;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.componentes = this.dataService.getMenuOpts();
    this.menuCtrl.enable(true);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
