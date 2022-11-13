import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassengerPageRoutingModule } from './passenger-routing.module';

import { PassengerPage } from './passenger.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassengerPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [PassengerPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PassengerPageModule {}
