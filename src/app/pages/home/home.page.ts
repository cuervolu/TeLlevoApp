import { Component, OnInit } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$ = this.userService.currentUserProfile$;
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    //Para mostrar el skeleton text, this.loading se convierte en verdadero
    this.loading = true;
    //Cuando termina de obtener la información, this.loading se convierte en falso
    this.user$.subscribe(() => {this.loading = false;});
  }

}
