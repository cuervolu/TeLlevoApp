import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/users.service';
import { AlertController, IonModal, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  profile = null;
  loading = false;
  isModalOpen = false;
  profileForm = this.fb.group({
    uid: [''],
    email: [''],
    username: [''],
    firstName: [''],
    lastName: [''],
  });
  // user$ = this.userService.currentUserProfile$;

  handlerMessage = '';
  roleMessage = '';

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.loading = false;
      this.profileForm.patchValue(this.profile);
    });
    console.log(this.profile);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async confirm() {
    const { uid, ...data } = this.profileForm.value;
    if (!uid) {
      this.presentToast('Ha ocurrido un error', 'danger');
    }
    const loading = await this.loadingCtrl.create({
      message: 'Modificando datos...',
      spinner: 'circles',
    });

    loading.present();

    this.userService.updateUser({ uid, ...data }).subscribe(() => {
      loading.dismiss();
      this.presentToast('Se ha modificado con éxito', 'success');
      this.isModalOpen = false;
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Foto de Perfil',
      buttons: [
        {
          text: 'Eliminar foto actual',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteImage();
          },
        },
        {
          text: 'Elegir de la biblioteca',
          icon: 'cloud-upload-outline',
          handler: () => {
            this.changeImage();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if (image) {
      const loading = await this.loadingCtrl.create({
        spinner: 'circles',
        cssClass: 'custom-loading',
      });
      await loading.present();
      const result = await this.userService.uploadImage(image);
      loading.dismiss();
      this.presentToast('Se ha modificado con éxito', 'success');
      if (!result) {
        this.presentToast('Hubo un error al subir tu avatar', 'danger');
      }
    }
  }
  async deleteImage() {
    const alert = await this.alertCtrl.create({
      header: '¿Estás seguro?',
      message: 'Esta acción es definitiva',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: async () => {
            this.handlerMessage = 'Alert confirmed';
            const loading = await this.loadingCtrl.create({
              spinner: 'circles',
              cssClass: 'custom-loading',
            });
            await loading.present();
            const result = this.userService.deleteImage();
            loading.dismiss();
            if (result) {
              this.presentToast('Se ha eliminado con éxito', 'success');
            } else {
              this.presentToast('Ha ocurrido un error', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
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
