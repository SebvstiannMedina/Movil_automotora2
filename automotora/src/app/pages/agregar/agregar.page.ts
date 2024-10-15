import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage {
  nombre: string = '';
  descripcion: string = '';
  precio!: number ;
  imagen: any;
  categoria!: number;
  mensajeError: string = '';

  constructor(private alertController: AlertController, private bd:ServiceBDService,  private router: Router) {}
  
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.imagen = image.webPath;
  
   
  };
  /////////////////////
  validarPrecio(event: any) {
    const valor = event.target.value;

    // Validacion del precio
    if (!/^\d*\.?\d+$/.test(valor)) {
      this.mensajeError = 'Solo se permiten números';
    } else if (parseFloat(valor) < 1000) {
      this.mensajeError = 'El precio no puede ser menor a 1000';
    } else if(!/^\d+(\.\d{1,2})?$/.test(valor)) {
      this.mensajeError = 'Solo se permiten dos decimales';
    }  else {
      this.mensajeError = '';
    }
  }

    // Validacion de que los campos esten llenos para poder agregar
    async presentAlert() {
      if (!this.nombre || !this.descripcion || !this.precio || !this.categoria || this.mensajeError) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Todos los campos son obligatorios ',
          buttons: ['Volver'],
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'El producto fue agregado exitosamente.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.bd.insertarCrud(this.nombre, this.descripcion, this.imagen, this.precio, this.categoria);
              this.navigateToCategory(this.categoria); // Navigate to the category page
            }
          }],
        });
        await alert.present();
      }
    }
    private navigateToCategory(categoria: number) {
      let route = '';
    
      switch (categoria) {
        case 1: // Aeromatizantes
          route = '/aeromatizantes';
          break;
        case 2: // Cars Deportivos
          route = '/cars-depor';
          break;
        case 3: // Cars Muscle
          route = '/cars-muscle';
          break;
        case 4: // Llantas
          route = '/llantas';
          break;
        case 5: // Otros
          route = '/otros';
          break;
        default:
          return; // No valid category selected
      }
    
      this.router.navigate([route]);
    }
    
    
}
