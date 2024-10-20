import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  //Typescript:

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  verMenu = true; //CY3rto  menu==true para afirmar la apertura de este  :v
  //data!: number;
  constructor(private router: Router, private storage: NativeStorage, private alertController: AlertController) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkMenuVisibility(event.url);
      }
    });
  }


  checkMenuVisibility(url: string) {

    // Ojo aqui abajo se señalan donde no se debe ver el menu o nos funaran
    const noveras = ['/login', '/registro', '/ver-perfil', '/editar-perfil',
      '/recupera-contra', '/cambio-contra', '/not-found', '/registro-venta'];

    this.verMenu = !noveras.includes(url);
  }

  //rol = this.storage.getItem('Rol');

  

  /*async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'LOGIN',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }*/

  







}
