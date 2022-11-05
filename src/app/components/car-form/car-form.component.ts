import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService, UserService } from '../../services';
import { Vehicle, UserProfile } from '../../models/user.interface';

interface Model {
  id: number;
  year: number;
  make: string;
  model: string;
  type: string;
}

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {
  profile: UserProfile;
  showMakeLoader: boolean;
  selectedMake: string;
  maker: [] = [];

  showYearLoader = false;
  disableYearSelection = true;
  selectedYear: number;
  years: number[] = [];

  showModelLoaders = false;
  disableModelSelection = true;
  selectedModel: string;
  models: Model[] = [];

  showSubmitLoader = false;

  carForm = this.fb.group({
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    anio: ['', Validators.required],
  });

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getMake();
  }

  getMake() {
    this.showMakeLoader = true;
    this.dataService.getMake().subscribe((data) => {
      this.maker = data;
      this.showMakeLoader = false;
    });
  }

  getYear() {
    this.showYearLoader = true;
    this.dataService.getYear().subscribe((data) => {
      this.years = data;
      //Ordenar de manera descendente
      this.years.sort((a, b) => b - a);
      this.showYearLoader = false;
    });
  }

  getModel() {
    this.showModelLoaders = true;
    this.dataService
      .getModel(this.selectedMake, this.selectedYear)
      .subscribe((data) => {
        this.models = data;
        this.showModelLoaders = false;
      });
  }

  onSelectMake(ev) {
    this.selectedMake = ev.target.value;
    this.getYear();
    this.disableYearSelection = false;
  }

  onSelectYear(ev) {
    this.selectedYear = ev.target.value;
    this.getModel();
    this.disableModelSelection = false;
  }

  onSelectedModel(ev) {
    this.selectedModel = ev.target.value;
  }


  onSubmit() {
    if (!this.carForm.valid) {
      this.presentToast('Los datos ingresados no son válidos', 'danger');
      return;
    }
    const data: Vehicle = {
      ...this.carForm.value,
      anio: +this.carForm.value.anio,
    };
    if (!this.profile.uid) {
      this.presentToast('Ha ocurrido un error', 'danger');
      return;
    }
    this.showSubmitLoader = true;
    this.userService
      .updateDriverVehicle(this.profile.uid, { ...data })
      .subscribe(() => {
        this.showSubmitLoader = false;
        this.presentToast('Se ha modificado con éxito', 'success');
        return this.modalCtrl.dismiss(null, 'confirm');
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
