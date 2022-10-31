import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    //Mostrar  slides solo al ser la primera vez de uso
    const checkView = localStorage.getItem('pageDisplayed');
    if (checkView) {
      this.router.navigateByUrl('/login');
    } else {
      localStorage.setItem('pageDisplayed', 'ok');
    }
  }
}
