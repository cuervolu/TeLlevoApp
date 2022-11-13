import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IsDrivingComponent } from './is-driving/is-driving.component';
import { IsNotDrivingComponent } from './is-not-driving/is-not-driving.component';
import { CarFormComponent } from './car-form/car-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { IsSearchingComponent } from './is-searching/is-searching.component';



@NgModule({
  declarations: [
    IsDrivingComponent,
    IsNotDrivingComponent,
    CarFormComponent,
    DriverProfileComponent,
    IsSearchingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    IsDrivingComponent,
    IsNotDrivingComponent,
    CarFormComponent,
    DriverProfileComponent,
    IsSearchingComponent
  ]
})
export class ComponentsModule { }
