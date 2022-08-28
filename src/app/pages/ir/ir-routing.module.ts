import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IrPage } from './ir.page';

const routes: Routes = [
  {
    path: '',
    component: IrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IrPageRoutingModule {}
