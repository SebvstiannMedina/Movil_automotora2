import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from './service/service-bd.service';

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
    private alertController: AlertController,
    private bd: ServiceBDService
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

  // Método para cerrar sesión
  async logout() {
    try {
      // Limpiar todos los datos de la sesión
      await this.storage.clear();
      this.nombreUsuario = 'Invitado';
      
      const alert = await this.alertController.create({
        header: 'Sesión Cerrada',
        message: 'Has cerrado sesión exitosamente',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // Redirigir al login después de que el usuario presione OK
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alert.present();
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al cerrar la sesión. Por favor, intenta nuevamente.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'LOGIN',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}