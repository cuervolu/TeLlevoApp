import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgetPassPageRoutingModule } from './forget-pass-routing.module';

import { ForgetPassPage } from './forget-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgetPassPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgetPassPage]
})
export class ForgetPassPageModule {}
