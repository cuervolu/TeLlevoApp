import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  slides: { img: string; titulo: string; desc: string }[] = [
    {
      img: '/assets/slides/car.svg',
      titulo: 'Retorna a tu hogar seguramente',
      desc: 'Organízate con alumnos de tu misma sede',
    },
    {
      img: '/assets/slides/students.svg',
      titulo: 'Compañerismo',
      desc: 'Fomentamos el compañerismo entre alumnos',
    },
    {
      img: '/assets/slides/time.svg',
      titulo: 'Reducir los tiempos',
      desc: 'Destinados a encontrar movilización de retorno a hogares',
    },
    {
      img: '/assets/slides/ubicacion.svg',
      titulo: 'Tu ubicación',
      desc: '¡Siempre sabremos donde estás!',
    },
  ];

  constructor(
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    //Desactiva el menu si se encuentra en la página de inicio
    this.router.events.subscribe((event: RouterEvent) => {
      if (
        (event instanceof NavigationEnd && event.url === '/inicio') ||
        event.url === '/' ||
        event.url === '/sign-up' ||
        event.url === '/forget-pass'
      ) {
        this.menuCtrl.enable(false);
      }
    });
    //Mostrar  slides solo al ser la primera vez de uso
    const checkView = localStorage.getItem('pageDisplayed');
    if (checkView) {
      this.mostrarLogin();
    } else {
      localStorage.setItem('pageDisplayed', 'ok');
    }
  }

  async mostrarLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });
    await modal.present();

    const resp = await modal.onDidDismiss();
  }
}