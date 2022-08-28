import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IrPageRoutingModule } from './ir-routing.module';

import { IrPage } from './ir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IrPageRoutingModule
  ],
  declarations: [IrPage]
})
export class IrPageModule {}
