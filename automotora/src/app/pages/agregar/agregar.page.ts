import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  nombre: string = '';
  descripcion: string = '';
  precio!: number;
  imagen: any;
  mensajeError: string = '';
  categoriaSeleccionada: number = 0; // Nueva propiedad para almacenar la categoría seleccionada

  categorias: any;  // Inicializamos como array vacío
  
  constructor(
    private alertController: AlertController,
    private bd: ServiceBDService,
    private router: Router
  ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(ready => {
      if (ready) {
        this.cargarCategorias();
      }
    });
  }

  cargarCategorias() {
    this.bd.fetchCategoria().subscribe({
      next: (categorias) => {
        if (categorias && categorias.length > 0) {
          this.categorias = categorias;
          console.log('Categorías cargadas:', this.categorias);
        } else {
          console.log('No se encontraron categorías');
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });
      this.imagen = image.webPath;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  validarPrecio(event: any) {
    const valor = event.target.value;

    if (!/^\d*\.?\d+$/.test(valor)) {
      this.mensajeError = 'Solo se permiten números';
    } else if (parseFloat(valor) < 1000) {
      this.mensajeError = 'El precio no puede ser menor a 1000';
    } else if(!/^\d+(\.\d{1,2})?$/.test(valor)) {
      this.mensajeError = 'Solo se permiten dos decimales';
    } else {
      this.mensajeError = '';
      this.precio = parseFloat(valor);
    }
  }

  async presentAlert() {
    if (!this.nombre || !this.descripcion || !this.precio || !this.categoriaSeleccionada || this.mensajeError) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios',
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
            this.agregarProducto();
          }
        }],
      });
      await alert.present();
    }
  }

  private agregarProducto() {
    try {
      this.bd.insertarCrud(
        this.nombre,
        this.descripcion,
        this.imagen,
        this.precio,
        this.categoriaSeleccionada
      );
      this.limpiarFormulario();
      this.router.navigate(['/eliminar']); 
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  }

  private limpiarFormulario() {
    this.nombre = '';
    this.descripcion = '';
    this.precio = 0;
    this.imagen = null;
    this.categoriaSeleccionada = 0;
  }
}