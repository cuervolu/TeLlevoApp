import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AvatarService } from '../../services/avatar.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  profile = null;
  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  ngOnInit() {}

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    console.log(image);
    if (image) {
      const loading = await this.loadingCtrl.create({
        spinner: 'circles',
        cssClass: 'custom-loading',
      });
      await loading.present();
      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();
      if (!result) {
        const alert = await this.alertCtrl.create({
          header: 'Fallo en la subida',
          message: 'Hubo un error al subir tu avatar',
          buttons: ['Ok'],
        });
        await alert.present();
      }
    }
  }
}
