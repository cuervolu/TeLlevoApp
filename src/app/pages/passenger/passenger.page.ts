import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {
  profile = null;
  loading = false;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.userService.getChoferBySede(this.profile.sede, this.profile.uid).subscribe((res) => {
        console.log(res);
        this.loading = false;
      });
    });
  }

}
