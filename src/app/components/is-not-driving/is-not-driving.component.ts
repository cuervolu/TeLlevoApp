import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { ApirutasService } from 'src/app/services';
import { ContratoRuta, UserProfile } from 'src/app/models';
import { element } from 'protractor';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-is-not-driving',
  templateUrl: './is-not-driving.component.html',
  styleUrls: ['./is-not-driving.component.scss'],
})
export class IsNotDrivingComponent implements OnInit {
  @Output() sendRutaToParent = new EventEmitter<ContratoRuta>();
  @Output() sendRutaIdToParent = new EventEmitter<string>();
  profile = null;
  loading = false;
  pendientes: ContratoRuta[] = [];
  passenger: UserProfile;

  constructor(
    private userService: UserService,
    private rutas: ApirutasService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    let datos = [];
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.rutas.getRutasOfChofer().subscribe((res) => {
        datos = res;
        this.pendientes = datos.slice(0, 3);
        this.loading = false;
      });
      if (this.profile.vehiculo === undefined) {
        this.notVehicleAlert();
      }
    });
  }

  async notVehicleAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Error!',
      subHeader: 'No posees un vehiculo registrado',
      message: 'Si no posees un vehículo, no puedes utilizar está página',
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

  async getRuta(index: number) {
    const result = await this.rutas.getCurrentRutaOfChofer(
      this.pendientes[index].pasajero.uid
    );
    this.sendRutaIdToParent.emit(result);
    return result;
  }

  aceptar(index: number) {
    this.getRuta(index).then((data) => {
      this.rutas
        .getRutas(this.profile, data)
        .pipe(take(1))
        .subscribe((response) => {
          const ruta = response as ContratoRuta;
          this.sendRutaToParent.emit(ruta);
        });
    });
  }

  rechazar(index: number) {
    this.getRuta(index).then((data) => {
      const cancelar = this.rutas.cancelarRuta(this.profile, data);
      this.rutas
        .getRutas(this.profile, data)
        .pipe(take(1))
        .subscribe((response) => {
          const ruta = response as ContratoRuta;
          this.userService.enEspera(false, ruta.pasajero.uid);
          if (cancelar) {
            this.presentToast('Se ha cancelado el viaje con éxito', 'success');
          } else {
            this.presentToast('No se ha podido cancelar el viaje', 'danger');
          }
        });
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
      color,
    });

    await toast.present();
  }
}
