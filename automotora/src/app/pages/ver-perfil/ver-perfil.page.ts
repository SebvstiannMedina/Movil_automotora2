import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.page.html',
  styleUrls: ['./ver-perfil.page.scss'],
})
export class VerPerfilPage implements OnInit {
  arregloUsuario: any;

  constructor(private router: Router, private bd: ServiceBDService) {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchUsuario().subscribe(res => {
          this.arregloUsuario = res;
        });
      }
    });
  }

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchUsuario().subscribe(res => {
          this.arregloUsuario = res;
        });
      }
    });
  }

  irPagina(x: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        Usuario: x
      }
    };
    this.router.navigate(['/editar-perfil'], navigationExtras);
  }
}
