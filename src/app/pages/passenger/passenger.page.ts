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

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.drivers.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
