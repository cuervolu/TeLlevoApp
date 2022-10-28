import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EsChoferGuard, EsPasajeroGuard } from 'src/app/guards';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

import { TabsPage } from './tabs.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);


const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'explorar',
        loadChildren: () => import('../explorar/explorar.module').then( m => m.ExplorarPageModule),
        canActivate: [EsChoferGuard]
      },
      {
        path: 'passenger',
        loadChildren: () => import('../passenger/passenger.module').then( m => m.PassengerPageModule),
        canActivate: [EsPasajeroGuard]
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule),
        ...canActivate(redirectUnauthorizedToLogin)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
