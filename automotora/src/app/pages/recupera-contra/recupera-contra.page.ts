import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-recupera-contra',
  templateUrl: './recupera-contra.page.html',
  styleUrls: ['./recupera-contra.page.scss']
})
export class RecuperaContraPage implements OnInit {
  paso: number = 1;
  correo: string = '';
  preguntaSeguridad: string = '';
  respuestaUsuario: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  usuarioEncontrado: any = null;

  preguntaSeleccionada: string = '';


  preguntasSeguridad = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad naciste?',
    '¿Cuál es el nombre de tu mejor amigo de la infancia?',
    '¿Cuál fue tu primer auto?',
    '¿Cuál es tu animal favorito?'
  ];

  compararpreguntas(): boolean {
    return this.preguntaSeguridad === this.preguntaSeleccionada;
  }

  constructor(
    private bd: ServiceBDService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() { }

  async buscarUsuario() {
    if (!this.correo) {
      await this.mostrarAlerta('Error', 'Por favor ingrese un correo electrónico');
      return;
    }

    try {
      const usuario = await this.bd.buscarUsuarioPorCorreo(this.correo);
      console.log('Usuario encontrado:', usuario); // Debug log
      
      if (usuario) {
        this.usuarioEncontrado = usuario;
        this.preguntaSeguridad = usuario.preguntaSeleccionada; // Cambiado a preguntaSeleccionada
        console.log('Pregunta de seguridad:', this.preguntaSeguridad); // Debug log
        this.paso = 2;
      } else {
        await this.mostrarAlerta('Error', 'Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al buscar el usuario');
    }
  }

  async verificarRespuesta() {
    if (!this.respuestaUsuario) {
      await this.mostrarAlerta('Error', 'Por favor ingrese su respuesta');
      return;
    }

    try {
      // Comparar directamente con la respuesta almacenada en usuarioEncontrado
      if (this.usuarioEncontrado.respuestaSeguridad.toLowerCase() === this.respuestaUsuario.toLowerCase()
      && this.preguntaSeguridad === this.preguntaSeleccionada) {
        this.paso = 3;
      } else {
        await this.mostrarAlerta('Error', 'Informacion de seguridad incorrecta');
      }
    } catch (error) {
      await this.mostrarAlerta('Error', 'Informacion de seguridad incorrecta');
    }
  }

  async cambiarContrasena() {
    if (!this.validarContrasenas()) {
      return;
    }

    try {
      await this.bd.modificarContrasena2(this.correo, this.nuevaContrasena);
      await this.mostrarAlerta('Éxito', 'Contraseña actualizada correctamente');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      await this.mostrarAlerta('Error', 'No se pudo actualizar la contraseña');
    }
  }

  validarContrasenas(): boolean {
    if (this.nuevaContrasena.length < 8) {
      this.mostrarAlerta('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (!/[A-Z]/.test(this.nuevaContrasena)) {
      this.mostrarAlerta('Error', 'La contraseña debe contener al menos una mayúscula');
      return false;
    }

    if (!/[0-9]/.test(this.nuevaContrasena)) {
      this.mostrarAlerta('Error', 'La contraseña debe contener al menos un número');
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.nuevaContrasena)) {
      this.mostrarAlerta('Error', 'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)');
      return false;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}