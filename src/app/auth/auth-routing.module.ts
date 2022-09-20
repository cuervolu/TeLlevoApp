import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

import { AuthPage } from './auth.page';
import { ResetComponent } from './reset/reset.component';
const redirectLoggedInToHome = () => redirectLoggedInTo(['/tabs/home']);
const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: 'reset',
        component: ResetComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
  static components = [
    AuthPage,
    ResetComponent
  ];
}
