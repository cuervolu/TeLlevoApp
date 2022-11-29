import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApirutasService, UserService } from 'src/app/services';
import { ContratoRuta, UserProfile } from '../../models/';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-on-hold',
  templateUrl: './on-hold.component.html',
  styleUrls: ['./on-hold.component.scss'],
})
export class OnHoldComponent implements OnInit {
  @Input() chofer: UserProfile;
  @Output() sendRutaIdToParent = new EventEmitter<string>();
  loading = false;
  rutaID: string;
  profile: UserProfile;
  rutaData: ContratoRuta;

  constructor(
    private rutas: ApirutasService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loading = true;
    if (this.chofer === null) {
      this.chofer = JSON.parse(localStorage.getItem('chofer'));
    }
    this.rutaID = localStorage.getItem('ruta');
    this.sendRutaIdToParent.emit(this.rutaID);
    this.rutas.getRutas(this.chofer, this.rutaID).subscribe(
      (data: ContratoRuta) => {
        this.rutaData = data;
        if (this.rutaData.cancelada) {
          localStorage.removeItem('chofer');
          localStorage.removeItem('ruta');
          this.enEspera(false);
        }
        this.userService.getChoferByUid(data.chofer.uid).subscribe((res) => {
          this.profile = res;
          this.loading = false;
        });
      },
      (e) => {
        console.error(e);
      }
    );
  }

  enEspera(onHold: boolean) {
    const enEspera = this.userService.enEspera(onHold);
    if (enEspera) {
      console.log(`Usuario en espera: ${onHold}`);
    } else {
      console.error(`Usuario en espera: ${onHold}`);
    }
  }

  async cancelar() {
    const alert = await this.alertCtrl.create({
      header: `¿Está seguro?`,
      message: `Está decisión es irreversible`,
      mode: 'ios',
      buttons: [
        {
          text: 'Estoy seguro',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            console.log('Confirmado');
            const cancelar = this.rutas.cancelarRuta(this.chofer, this.rutaID);
            if (cancelar) {
              this.presentToast(
                'Se ha cancelado el viaje con éxito',
                'success'
              );
            } else {
              this.presentToast('No se ha podido cancelar el viaje', 'danger');
            }
            this.enEspera(false);
            localStorage.removeItem('chofer');
            localStorage.removeItem('ruta');
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
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
