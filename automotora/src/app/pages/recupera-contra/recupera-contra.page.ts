import { Component } from '@angular/core';
import { AlertController} from '@ionic/angular';
@Component({
  selector: 'app-recupera-contra',
  templateUrl: './recupera-contra.page.html',
  styleUrls: ['./recupera-contra.page.scss'],
})
export class RecuperaContraPage {
  email: string = ''; // Propiedad para almacenar el correo electrónico ingresado

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'RECUPERACION DE CONTRASEÑA ',
      message: 'Enlace de recuperación enviado',
      buttons: ['ok'],
    });

    await alert.present();
  }

////////////////////////
  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'RECUPERACION DE CONTRASEÑA ',
      message: 'Por favor ingresa un correo electrónico.',
      buttons: ['ok'],
    });

    await alert.present();
  }



///////////////////////////////////  
  constructor(private alertController: AlertController) {}

  // Método para manejar el envío del enlace de recuperación
  sendResetLink() {
    if (this.email) {
      console.log('Enlace de recuperación enviado a: ', this.email);
      // Aquí deberías agregar el servicio para enviar el enlace de recuperación
      ///alerta intrusiva
          this.presentAlert();
      
    } else {
      // Manejo del caso en que el campo de correo esté vacío
      console.error('Por favor ingresa un correo electrónico.');
        this.presentAlert2();
    }
  }
}
