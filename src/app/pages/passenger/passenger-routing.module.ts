import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerPage } from './passenger.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerPageRoutingModule {}
