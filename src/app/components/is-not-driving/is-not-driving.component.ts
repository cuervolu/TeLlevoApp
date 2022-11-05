import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-is-not-driving',
  templateUrl: './is-not-driving.component.html',
  styleUrls: ['./is-not-driving.component.scss'],
})
export class IsNotDrivingComponent implements OnInit {
  profile = null;
  loading = false;

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.loading = false;
      if (this.profile.vehiculo === undefined) {
        this.notVehicleAlert();
      }
    });
  }

  async notVehicleAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Error!',
      subHeader: 'No posees un vehiculo registrado',
      message: 'Si no posees unv vehículo, no puedes utilizar está página',
      buttons: [
        {
          text: 'Ir a tu Perfil',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl('/tabs/perfil');
          },
        },
      ],
      backdropDismiss: false,
      mode: 'ios',
    });
    await alert.present();
  }
}
