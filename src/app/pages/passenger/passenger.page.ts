import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonModal, LoadingController, ModalController } from '@ionic/angular';

import { UserService } from '../../services';
import { UserProfile } from '../../models';
import { DriverProfileComponent } from '../../components/driver-profile/driver-profile.component';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  isModalOpen = false;
  profile = null;
  loading = false;
  drivers: UserProfile[] = [];
  driverProfile: UserProfile = null;

  constructor(private userService: UserService, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.getDrivers();
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

  async onSelectDriver(uid: string){
    const modal = await this.modalCtrl.create({
      component: DriverProfileComponent,
      mode: 'ios',
      componentProps: {
        uid,
      },
    });
    modal.present();
  }



  confirm(){}
}

