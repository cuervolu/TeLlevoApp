import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$ = this.userService.currentUserProfile$;
  loading = false;

  constructor(private userService: UserService, private router: Router, private menuCtrl: MenuController) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    //Para mostrar el skeleton text, this.loading se convierte en verdadero
    this.loading = true;
    //Cuando termina de obtener la información, this.loading se convierte en falso
    this.user$.subscribe(() => {
      this.loading = false;
    });
  }

  esChofer(value: boolean) {
    this.userService.esChofer(value);
    if(value){
      this.router.navigateByUrl('/tabs/explorar');
    }else{
      this.router.navigateByUrl('/tabs/passenger');
    }
  }
}
