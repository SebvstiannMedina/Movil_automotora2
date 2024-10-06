import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage {
  nombre: string = '';
  descripcion: string = '';
  precio: string | number = '';
  imagen: string = '';
  categoria: string = '';
  mensajeError: string = '';

  constructor(private alertController: AlertController, private bd:ServiceBDService) {}

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
    if (!this.nombre || !this.descripcion || !this.precio || !this.imagen || !this.categoria || this.mensajeError) {
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
        buttons: ['OK'],
      });
      await alert.present();
      this.bd.insertarCrud(this.nombre, this.descripcion,this.imagen,typeof this.precio === 'string' ? parseFloat(this.precio) : this.precio, this.categoria);
    }
    
  }
}
