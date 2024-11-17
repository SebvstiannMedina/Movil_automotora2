import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

 
  crud:any;

  categoriaSeleccionada: number = 0; // Nueva propiedad para almacenar la categoría seleccionada

  categorias: any ;
  
  // Lista de productos a editar
  ngOnInit(){
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
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.crud.imagen = image.webPath;
  
   
  };

  mensajeError: string = '';

  constructor(private router: Router, 
    private activedrouter: ActivatedRoute,
    private alertController: AlertController, 
    private bd: ServiceBDService
  ) {
    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.crud = this.router.getCurrentNavigation()?.extras?.state?.['crud'];
      }
    })
    //this.bd.presentAlert("aaa",this.crud.idCrud);

  }

  validarPrecio(event: any) {
    const valor = event.target.value;

    if (!/^\d*\.?\d+$/.test(valor)) {
      this.mensajeError = 'Solo se permiten números';
    } else if (parseFloat(valor) < 1000) {
      this.mensajeError = 'El precio no puede ser menor a 1000';
    } else if (!/^\d+(\.\d{1,2})?$/.test(valor)) {
      this.mensajeError = 'Solo se permiten dos decimales';
    } else {
      this.mensajeError = '';
      this.crud.precio = parseFloat(valor);
    }
  }

  async presentAlert() {
    if (!this.crud.nombre || !this.crud.descripcion || !this.crud.precio || 
        !this.crud.idCategoria || this.mensajeError ) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios',
        buttons: ['Volver'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'El producto fue modificado exitosamente.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.modificar();
          }
        }],
      });
      await alert.present();
    }
  }

  private limpiarFormulario() {
    this.crud.nombre = '';
    this.crud.descripcion = '';
    this.crud.precio = 0;
    this.crud.imagen = null;
    this.crud.idCategoria = 0;
  }

  modificar() {
    this.bd.modificarCrud(
      this.crud.idCrud,
      this.crud.nombre,
      this.crud.descripcion,
      this.crud.imagen,
      this.crud.precio,
      this.crud.idCategoria
    );
  }
  
}
