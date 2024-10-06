import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

 
  crud:any;
  // Lista de productos a editar
  ngOnInit(){
  
  }

/*
  productos = [
    { imagen: 'https://via.placeholder.com/150', nombre: 'Llave 10', descripcion: 'Llave para tornillo 10"', precio: 6000 },
    { imagen: 'https://via.placeholder.com/150', nombre: 'Destornillador', descripcion: 'Destornillador estrella', precio: 4500 },
  ];
*/
  mensajeError: string = '';

  constructor(private router: Router, private activedrouter: ActivatedRoute,private alertController: AlertController, private bd: ServiceBDService) {
    this.activedrouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.crud = this.router.getCurrentNavigation()?.extras?.state?.['crud'];
      }
    })

  }

  modificar(){
    this.bd.modificarCrud(this.crud.idcrud,this.crud.nombre, this.crud.descripcion,this.crud.imagen,typeof this.crud.precio === 'string' ? parseFloat(this.crud.precio) : this.crud.precio, this.crud.categoria);
  }


/*
  // Validación del precio
  validarPrecio(valor: any): string {
    if (!/^\d*\.?\d+$/.test(valor)) {
      return 'Solo se permiten números';
    } else if (parseFloat(valor) < 1000) {
      return 'El precio no puede ser menor a 1000';
    } else if (!/^\d+(\.\d{1,2})?$/.test(valor)) {
      return 'Solo se permiten dos decimales';
    } 
    return '';
  }

  async editarProducto(index: number) {
    const producto = this.productos[index];

    const alert = await this.alertController.create({
      header: 'Editar Producto',
      inputs: [
        { name: 'imagen', type: 'url', placeholder: 'URL de la imagen', value: producto.imagen },
        { name: 'nombre', type: 'text', placeholder: 'Nombre del producto', value: producto.nombre },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción del producto', value: producto.descripcion },
        { name: 'precio', type: 'number', placeholder: 'Precio', value: producto.precio }    
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            // Verificar que todos los campos estén llenos
            if (!data.nombre || !data.descripcion || !data.precio || !data.imagen) {
              this.mensajeError = 'Todos los campos son obligatorios.';
              // Mostrar mensaje de error en alerta
              this.alertController.create({
                header: 'Error',
                message: this.mensajeError,
                buttons: ['OK']
              }).then(alert => alert.present());
              return false; // Evitar que se cierre la alerta si hay un error
            }

            // Validar precio antes de guardar
            const error = this.validarPrecio(data.precio);
            if (error) {
              this.mensajeError = error;
              // Mostrar mensaje de error en alerta
              this.alertController.create({
                header: 'Error',
                message: this.mensajeError,
                buttons: ['OK']
              }).then(alert => alert.present());
              return false; // Evitar que se cierre la alerta si hay un error
            } else {
              // Actualizar todos los campos del producto
              this.productos[index] = { 
                ...producto, 
                nombre: data.nombre, 
                precio: parseFloat(data.precio),  // Asegúrate de convertir a número
                descripcion: data.descripcion,
                imagen: data.imagen
              };
              this.alertController.create({
                header: 'Producto editado',
                message: 'El producto ha sido editado correctamente',
                buttons: ['OK']
              }).then(alert => alert.present());
            }
            return true; // Asegúrate de devolver true si no hay errores
          }
        }
      ]
    });
    
    await alert.present();
  }*/

}
