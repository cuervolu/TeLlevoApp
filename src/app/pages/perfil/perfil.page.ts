import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonModal,
  LoadingController,
  ModalController,
  Platform,
  RangeCustomEvent,
  ToastController,
} from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ActionSheetController } from '@ionic/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { RangeValue } from '@ionic/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { UserService, DataService } from '../../services';
import { CarFormComponent } from '../../components/car-form/car-form.component';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  enablePaymentRange: boolean;

  driverPrice: RangeValue;

  driverPriceUpdate: RangeValue;

  profile = null;

  loading = false;

  isModalOpen = false;

  sedes = [];

  profileForm = this.fb.group({
    uid: [''],
    email: [''],
    username: [''],
    firstName: [''],
    lastName: [''],
    sede: [''],
  });

  handlerMessage = '';
  roleMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private fb: FormBuilder,
    private plt: Platform
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService.getUserProfile().subscribe((data) => {
      this.profile = data;
      this.enablePaymentRange = this.profile.esChofer;
      this.loading = false;
      this.profileForm.patchValue(this.profile);
    });
  }

  //Abre modal de modificación de datos de usuario
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.getSedes();
  }

  //Modifica los datos de usuarios junto a Firebase
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

  async updateImage() {
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
          text: 'Capturar imagen',
          icon: 'camera-outline',
          handler: () => {
            this.captureImage();
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

  //Cambia la imagen de perfil por una almacenada en el teléfono
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

  //Cambia la imagen de perfil por una tomada con la cámara
  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      if (image) {
        const loading = await this.loadingCtrl.create({
          spinner: 'circles',
          cssClass: 'custom-loading',
        });
        await loading.present();
        this.saveImage(image);
        const result = await this.userService.uploadImage(image);
        loading.dismiss();
        this.presentToast('Se ha modificado con éxito', 'success');
        if (!result) {
          this.presentToast('Hubo un error al subir tu avatar', 'danger');
        }
      }
    } catch (error) {
      this.presentToast('Se ha cancelado la captura de imagen', 'danger');
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
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

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Obtiene la foto, la lee como un blob y luego la convierte al formato base64
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  //CHOFER
  esChofer(value: boolean) {
    const esChofer = this.userService.esChofer(value);
    if (esChofer) {
      if (!value) {
        this.userService.deletePrecioViaje();
      }
      this.presentToast('Se ha actualizado correctamente', 'success');
    } else {
      this.presentToast('No se ha podido actualizar', 'danger');
    }
  }

  pinFormatter(value: number) {
    return `$${value}`;
  }

  paymentValue(ev: Event) {
    this.driverPrice = (ev as RangeCustomEvent).detail.value;
  }

  onPaymentUpdate(ev: Event) {
    this.driverPriceUpdate = (ev as RangeCustomEvent).detail.value;
    const updatePrice = this.userService.precioViaje(
      Number(this.driverPriceUpdate)
    );
    if (updatePrice) {
      this.presentToast('Se ha actualizado correctamente', 'success');
    } else {
      this.presentToast('No se ha podido actualizar', 'danger');
    }
  }

  async showCarForm() {
    const modal = await this.modalCtrl.create({
      component: CarFormComponent,
      mode: 'ios',
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
      componentProps: {
        profile: this.profile,
      },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
  }

  //END CHOFER

  getSedes() {
    this.dataService.getSedes().subscribe((res) => {
      this.sedes = res;
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

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de querer cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Cerrar Sesión Cancelado';
          },
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('/', { replaceUrl: true });
          },
        },
      ],
      mode: 'ios',
    });
    await alert.present();
  }
}
