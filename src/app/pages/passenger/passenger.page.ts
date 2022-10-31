import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { UserService } from '../../services';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  profile = null;
  loading = false;
  drivers: UserProfile[] = [];
  constructor(private userService: UserService) {}

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
}

