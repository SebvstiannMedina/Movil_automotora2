import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  // Propiedades existentes
  nombre: string = '';
  email: string = '';
  contrasena: string = '';
  confirmaContrasena: string = '';
  id_rol: string = '2';
  imagen: any;

  // Nuevas propiedades para preguntas de seguridad
  preguntaSeleccionada: string = '';
  respuestaSeguridad: string = '';
  
  // Lista de preguntas disponibles
  preguntasSeguridad = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad naciste?',
    '¿Cuál es el nombre de tu mejor amigo de la infancia?',
    '¿Cuál fue tu primer auto?',
    '¿Cuál es tu animal favorito?'
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private bd: ServiceBDService,
    private storage: NativeStorage
  ) { }

  // Alertas existentes
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

  // Nueva validación para pregunta de seguridad
  validarPreguntaSeguridad(): boolean {
    return this.preguntaSeleccionada !== '' && 
           this.respuestaSeguridad.length >= 3 &&
           this.respuestaSeguridad.trim() !== '';
  }

  // Método de registro modificado
  registrar() {
    if (this.validarNombre(this.nombre) &&
        this.validarEmail(this.email) &&
        this.validarContrasena(this.contrasena) &&
        this.compararContrasenas(this.confirmaContrasena) &&
        this.validarPreguntaSeguridad()) {
          
      // Modificar el método insertarUsuario en el servicio para incluir la pregunta y respuesta
      this.bd.insertarUsuario(
        this.nombre, 
        this.email, 
        this.contrasena, 
        Number(this.id_rol), 
        this.imagen,
        this.preguntaSeleccionada,
        this.respuestaSeguridad
      );
      
      this.presentAlert();
      this.router.navigate(['/login']);
    } else {
      this.presentAlert2();
      console.log('Validaciones fallidas');
    }
  }

  // Métodos de validación existentes
  validarNombre(nombre: string): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/;
    const longitudMinima = 3;
    return nombre.length >= longitudMinima && nameRegex.test(nombre);
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
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

  compararContrasenas(confirmaContrasena: string): boolean {
    return this.contrasena === confirmaContrasena;
  }

  ngOnInit() {
    this.storage.clear();
  }
}