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
  usuario:any;
  /*
  nombre: string= ""; 
  email: string= "";
  contrasena: string= "";
*/
    // Validacion nombre
  validarNombre(): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/; 
    const longitudMinima = 3;
    return this.usuario.nombre.length >= longitudMinima && nameRegex.test(this.usuario.nombre);
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.usuario.imagen = image.webPath;
  
   
  };
  // Alertas
  async presentAlert() {
    if (!this.usuario.nombre) {
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
        message: 'Perfil fue editado',
        buttons: ['OK'],
      });
      await alert.present();
      this.bd.modificarUsuario(this.usuario.id,this.usuario.nombre,this.usuario.correo,this.usuario.imagen)
    }
  }

  constructor(private router: Router, private activedrouter: ActivatedRoute,private alertController: AlertController, private bd: ServiceBDService) {
    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.usuario = this.router.getCurrentNavigation()?.extras?.state?.['usuario'];
      }
    })

  }

  ngOnInit() {
  }
  volver() {

    this.router.navigate(['/home']);
    this.presentAlert();
   
  }


}
