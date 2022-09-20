import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...AuthRoutingModule.components],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
})
export class AuthPageModule {}
