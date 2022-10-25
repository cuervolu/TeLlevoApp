import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassengerPageRoutingModule } from './passenger-routing.module';

import { PassengerPage } from './passenger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassengerPageRoutingModule
  ],
  declarations: [PassengerPage]
})
export class PassengerPageModule {}
