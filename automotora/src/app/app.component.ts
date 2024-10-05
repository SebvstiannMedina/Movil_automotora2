import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  verMenu = true; //CY3rto  menu==true para afirmar la apertura de este  :v
 
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkMenuVisibility(event.url);
      }
    });
  }

  checkMenuVisibility(url: string) {

    // Ojo aqui abajo se señalan donde no se debe ver el menu o nos funaran
    const noveras = ['/login', '/registro', '/ver-perfil','/editar-perfil', 
                    '/recupera-contra', '/cambio-contra','/not-found','/registro-venta'];

    this.verMenu = !noveras.includes(url);
  }

}
