import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  
  user: any;
  correoOriginal: string = ''; // Variable local para guardar el correo original
  isLoading = false; // Variable para el spinner

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
        this.correoOriginal = this.user.correo; // Almacenar el correo original en la variable local
      }
    });
  }

  ngOnInit() {}

  // Función para tomar una foto y actualizar la imagen del usuario
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.user.imagen = image.webPath;
  };

  // Validación del nombre
  validarNombre(): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/;
    const longitudMinima = 3;
    return this.user.nombre.length >= longitudMinima && nameRegex.test(this.user.nombre);
  }

  // Validación del correo electrónico
  validarEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(this.user.correo);
  }

  // Mostrar alertas dependiendo del estado
  async presentAlert() {
    if (!this.user.nombre) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay nada que editar',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!this.validarNombre()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El nombre debe contener al menos 3 letras y no incluir números.',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!this.validarEmail()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo electrónico no es válido.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      await this.verificarYModificar(); 
    }
  }

  // Verificación de correo y modificación
  async verificarYModificar() {
    this.isLoading = true; // Activa el spinner

    // Comprobar si el correo no ha cambiado
    if (this.user.correo === this.correoOriginal) {
      this.isLoading = false; // Desactiva el spinner
      // Modificar directamente si el correo no ha cambiado
      await this.bd.modificarUsuario(this.user.idusuario, this.user.nombre, this.user.correo, this.user.imagen);
      this.router.navigate(['/ver-perfil'], { replaceUrl: true });
      return;
    }

    // Si el correo cambió, verificar si ya existe
    const correoExiste = await this.bd.verificarCorreoExistente(this.user.correo);
    this.isLoading = false; // Desactiva el spinner

    if (correoExiste) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo electrónico ya está registrado. Por favor, usa uno diferente.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      // Modificar usuario si el correo no está en uso
      await this.bd.modificarUsuario(this.user.idusuario, this.user.nombre, this.user.correo, this.user.imagen);
      this.router.navigate(['/ver-perfil'], { replaceUrl: true });
    }
  }

  // Navegar a la página de cambio de contraseña
  irACambioContrasena() {
    this.router.navigate(['/cambio-contra'], {
      state: {
        user: this.user
      }
    });
  }
}
