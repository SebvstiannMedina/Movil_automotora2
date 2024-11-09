import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  verMenu = true;  // Controla la visibilidad del menú
  nombreUsuario: string = '';  // Variable para almacenar el nombre del usuario

  constructor(
    private router: Router,
    private storage: NativeStorage,
    private alertController: AlertController
  ) {
    // Controla la visibilidad del menú según la ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkMenuVisibility(event.url);
      }
    });
  }

  ngOnInit() {
    // Al iniciar la aplicación, intentamos obtener el nombre del usuario desde NativeStorage
    this.storage.getItem('Nombre').then(
      (nombre) => {
        this.nombreUsuario = nombre || 'Invitado';  // Si no existe, ponemos 'Invitado'
      },
      (error) => {
        console.log('Error al obtener el nombre del usuario:', error);
        this.nombreUsuario = 'Invitado';  // En caso de error o ausencia de nombre
      }
    );
  }

  // Lógica para controlar la visibilidad del menú según la ruta
  checkMenuVisibility(url: string) {
    const noveras = [
      '/login', '/registro', '/ver-perfil', '/editar-perfil',
      '/recupera-contra', '/cambio-contra', '/not-found', '/registro-venta'
    ];
    this.verMenu = !noveras.includes(url);
  }

  /*async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'LOGIN',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }*/
}
