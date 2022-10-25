import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  esChofer = true;
  profile = null;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe((data) => {
      this.esChofer = data.esChofer;
    });
  }

}
