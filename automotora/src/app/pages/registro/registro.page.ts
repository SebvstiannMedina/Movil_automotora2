import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

////ALertas
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'REGISTRO',
      message: 'Registro exitoso',
      buttons: ['ok'],
    });

    await alert.present();
  }

  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'REGISTRO',
      message: 'Registro fallido',
      buttons: ['ok'],
    });

    await alert.present();
  }
////declara lo que registrara
  objetoRegistro = {
    nombre: '',
    email: '',
    contrasena: '',
    confirmaContrasena: '',
  };

  constructor(private router: Router, private alertController: AlertController, private bd:ServiceBDService,  private storage: NativeStorage) { }

  // Validación del registro
  registrar() {
    if (this.validarNombre(this.objetoRegistro.nombre) &&
        this.validarEmail(this.objetoRegistro.email) &&
        this.validarContrasena(this.objetoRegistro.contrasena) &&
        this.compararContrasenas(this.objetoRegistro.confirmaContrasena)) {
      
      console.log('Registro exitoso:', this.objetoRegistro);
      this.bd.insertarUsuario(this.objetoRegistro.nombre, this.objetoRegistro.email, this.objetoRegistro.contrasena, 1);
      
      
      
    } else {
      this.router.navigate(['/registro']);
      console.log('Validaciones fallidas');
    }
  }

  // Validación del nombre 
  validarNombre(nombre: string): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/;
    const longitudMinima = 3;
      return nombre.length >= longitudMinima && nameRegex.test(nombre);
  }

  // Validación del email
  validarEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // Validación de la contraseña
  validarContrasena(contrasena: string): boolean {
    const longitudMinima = 8;
    const longitudMaxima = 16;
    const contrasenaRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const mayusculaRegex = /[A-Z]/;
    return contrasena.length >= longitudMinima && contrasena.length <= longitudMaxima && contrasenaRegex.test(contrasena)&& mayusculaRegex.test(contrasena);
  }
    // Comparación de contraseñas

    compararContrasenas(confirmaContrasena: string): boolean {
      return this.objetoRegistro.contrasena === confirmaContrasena;
    }
    
  ngOnInit() {
    this.storage.clear();
  }

  
  // Interpolación y redirección
  regienvia() {
    const navigationExtras: NavigationExtras = {
      state: {
        objetoRegistro: this.objetoRegistro
      }
    };
    this.router.navigate(['/login'], navigationExtras);

    this.registrar();
  }

}
