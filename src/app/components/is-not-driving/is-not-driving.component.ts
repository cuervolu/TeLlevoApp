import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-is-not-driving',
  templateUrl: './is-not-driving.component.html',
  styleUrls: ['./is-not-driving.component.scss'],
})
export class IsNotDrivingComponent implements OnInit {

  profile = null;
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.loading = false;
    });
  }
}
