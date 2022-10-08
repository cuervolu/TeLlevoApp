import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IsDrivingComponent } from './is-driving/is-driving.component';
import { IsNotDrivingComponent } from './is-not-driving/is-not-driving.component';



@NgModule({
  declarations: [
    IsDrivingComponent,
    IsNotDrivingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    IsDrivingComponent,
    IsNotDrivingComponent
  ]
})
export class ComponentsModule { }
