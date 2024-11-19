import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from './service/service-bd.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  verMenu = true;
  nombreUsuario: string = '';
  
  
  constructor(
    private router: Router,
    private storage: NativeStorage,
    private alertController: AlertController,
    private bd: ServiceBDService
  ) {
    // Mejora en el manejo de eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      this.checkMenuVisibility(event.url);
      this.updateUserData(); // Actualiza los datos cuando cambia la página
    });
  }

  ngOnInit() {
    // Suscripción al estado de la base de datos
    this.bd.dbState().pipe(
      takeUntil(this.destroy$)
    ).subscribe(async (isReady) => {
      if (isReady) {
        await this.updateUserData();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para actualizar datos del usuario
  private async updateUserData() {
    try {
      const nombre = await this.storage.getItem('Nombre');
      this.nombreUsuario = nombre || 'Invitado';
      
      // Aquí puedes agregar más actualizaciones de datos si es necesario
      this.bd.fetchUsuario().pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (userData) => {
          // Actualiza los datos del usuario según sea necesario
          if (userData) {
            // Actualiza los datos necesarios
            this.nombreUsuario =  this.nombreUsuario;
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  checkMenuVisibility(url: string) {
    const noveras = [
      '/login', '/registro', '/ver-perfil', '/editar-perfil',
      '/recupera-contra', '/cambio-contra', '/not-found'
    ];
    this.verMenu = !noveras.includes(url);
  }

  async logout() {
    try {
      await this.storage.remove('Id');
      await this.cerrarSesion();
      
      const alert = await this.alertController.create({
        header: 'Sesión Cerrada',
        message: 'Has cerrado sesión exitosamente',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
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

  cerrarSesion() {
    this.bd.cerrarSesion();
  }
}