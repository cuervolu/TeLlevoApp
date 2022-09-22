import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorarPageRoutingModule } from './explorar-routing.module';

import { ExplorarPage } from './explorar.page';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorarPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ExplorarPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExplorarPageModule {}
