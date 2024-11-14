import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-cambio-contra',
  templateUrl: './cambio-contra.page.html',
  styleUrls: ['./cambio-contra.page.scss'],
})
export class CambioContraPage implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  user: any;

  constructor(
    private router: Router,
    private activedrouter: ActivatedRoute,
    private alertController: AlertController,
    private bd: ServiceBDService
  ) {
    // Obtener los datos del usuario enviados desde la página anterior
    this.activedrouter.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.user = this.router.getCurrentNavigation()?.extras?.state?.['user'];
      }
    });
  }

  ngOnInit() {}

  // Validación de la contraseña
  validarContrasena(): boolean {
    // Regex que verifica:
    // - Al menos una letra mayúscula: (?=.*[A-Z])
    // - Al menos un carácter especial: (?=.*[!@#$%^&*(),.?":{}|<>])
    // - Longitud entre 8 y 16 caracteres: {8,16}
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
    
    console.log('Validación nueva contraseña:', passwordRegex.test(this.newPassword));
    console.log('Validación confirmación:', passwordRegex.test(this.confirmPassword));
    
    // Verifica que tanto la nueva contraseña como la confirmación cumplan con todos los requisitos
    return passwordRegex.test(this.newPassword) && passwordRegex.test(this.confirmPassword) && (this.newPassword === this.confirmPassword);
  }

  async cambiarContrasena() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor complete todos los campos',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas nuevas no coinciden',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      // Primero verificamos que la contraseña actual sea correcta
      const usuario = await this.bd.verificarContrasena(this.user.idusuario, this.currentPassword);
      
      if (!usuario) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'La contraseña actual es incorrecta',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
  
      // Si la contraseña actual es correcta, procedemos a cambiarla
      await this.bd.modificarContrasena(this.user.idusuario, this.newPassword);
      
      // Cerramos la sesión actual
      ///await this.bd.cerrarSesion(); esto era para probar
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Contraseña cambiada correctamente,sera redirigido en breve...',
        buttons: [{
          text: 'OK',
          handler: () => {
            // Redirigimos al login
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }],
      });
      await alert.present();
  
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al cambiar la contraseña',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}