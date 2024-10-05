import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambio-contra',
  templateUrl: './cambio-contra.page.html',
  styleUrls: ['./cambio-contra.page.scss'],
})
export class CambioContraPage implements OnInit {

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cambio',
      message: 'contraseña actualizada con exitoso',
      buttons: ['ok'],
    });

    await alert.present();
  }

  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No puede haber campos vacios o erroneos',
      buttons: ['ok'],
    });

    await alert.present();
  }


  contrasenaActual: string = '';
  nuevacontrasena: string = '';
  repetircontrasena: string = '';
  errorMensaje: string = '';
  
  constructor(private router: Router, private alertController: AlertController) { }
  
  ngOnInit() {
  }

  validarNuevacontrasena() {
    if (this.nuevacontrasena.length === 0) {
      this.errorMensaje = 'La nueva contrasena no puede estar vacía.';
      return;
    }
    
    const valida = this.validarContrasena(this.nuevacontrasena);
    if (!valida) {
      this.errorMensaje = 'La nueva contrasena debe tener entre 8 y 16 caracteres, al menos una mayúscula, un carácter especial y no puede estar vacía.';
    } else {
      this.errorMensaje = '';
    }
  }


  validarRepetircontrasena() {
    if (this.repetircontrasena !== this.nuevacontrasena) {
      this.errorMensaje = 'Las contrasenas no coinciden.';
      
    } else {
      this.errorMensaje = '';
    }
  }

  
  guardarCambios() {
    if (this.contrasenaActual.length === 0) {
      this.errorMensaje = 'La contrasena actual no puede estar vacía.';
      this.presentAlert2();
      return;
    } else {
      this.errorMensaje = '';
      this.presentAlert();

    }
    

  }

  validarContrasena(contrasena: string): boolean {
    const longitudMinima = 8;
    const longitudMaxima = 16;
    const contrasenaRegex = /[!@#$%^&*(),.?":{}|<>]/; 
    const mayusculaRegex = /[A-Z]/; 

    return contrasena.length >= longitudMinima &&
           contrasena.length <= longitudMaxima &&
           contrasenaRegex.test(contrasena) &&
           mayusculaRegex.test(contrasena);
  }
}
