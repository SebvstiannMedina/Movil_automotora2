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

  // Validación del nombre
  validarNombre(): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/;
    const longitudMinima = 3;
    return this.user.nombre.length >= longitudMinima && nameRegex.test(this.user.nombre);
  }



  // Función para mostrar alertas dependiendo del estado
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
        message: 'El nombre debe contener al menos 3 letras y no debe incluir números.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'EDITADO',
        message: 'Perfil fue editado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.modificar();
  
      // Actualizar los datos del usuario en la base de datos
//.then(() => {
         // Regresar a la página principal después de la actualización
          //this.router.navigate(['/home']);
       // })
       // .catch(err => {
         // console.error('Error al actualizar usuario:', err);
      //  });
    }
  }
  modificar(){
    this.bd.modificarUsuario(this.user.idusuario, this.user.nombre, this.user.correo,this.user.imagen) 
  }

  // Función para volver a la página principal
  //volver() {
   // this.router.navigate(['/home']);
 // }
}
