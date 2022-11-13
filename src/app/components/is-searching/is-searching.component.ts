import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { UserService } from 'src/app/services/users.service';
import { UserProfile } from 'src/app/models';
import { DriverProfileComponent } from '../driver-profile/driver-profile.component';

@Component({
  selector: 'app-is-searching',
  templateUrl: './is-searching.component.html',
  styleUrls: ['./is-searching.component.scss'],
})
export class IsSearchingComponent implements OnInit {
  profile = null;
  loading = false;
  drivers: UserProfile[] = [];
  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.getDrivers();
      this.loading = false;
    });
  }
  getDrivers() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.userService
        .getChoferBySede(this.profile.sede, this.profile.uid)
        .subscribe((res) => {
          this.drivers = res;
          this.loading = false;
        });
    });
  }

  async onSelectDriver(uid: string) {
    const modal = await this.modalCtrl.create({
      component: DriverProfileComponent,
      mode: 'ios',
      componentProps: {
        uid,
      },
    });
    modal.present();
  }

}
