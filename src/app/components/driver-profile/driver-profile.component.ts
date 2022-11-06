import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/models';
import { UserService } from '../../services';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
})
export class DriverProfileComponent implements OnInit {

  uid;
  driverProfile: UserProfile = null;
  loading = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getDriverByUid(this.uid);
  }

  getDriverByUid(uid: string){
    this.loading = true;
    this.userService.getChoferByUid(uid).subscribe((data) => {
      this.driverProfile = data;
      console.log(this.driverProfile);
      this.loading = false;
    });
  }
}
