/*import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.page.html',
  styleUrls: ['./eliminar.page.scss'],
})
export class EliminarPage implements OnInit {
  
  arreglocrud: any = [
    {
      id: '',
      nombre: '',
      descripcion: '',
      imagen:'',
      precio:'',
      stock:'',
      idCategoria:''
    }
  ]


  constructor(private alertController: AlertController, private bd: ServiceBDService, private router:Router) {
    this.bd.dbState().subscribe(data=>{
   
      if(data){

        this.bd.fetchCrud().subscribe(res=>{
          this.arreglocrud = res;
        })
      }
    })

   }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{

      if(data){

        this.bd.fetchCrud().subscribe(res=>{
          this.arreglocrud = res;
        })
      }
    })

  }
  modificar(x:any){
    let navigationsExtras: NavigationExtras = {
      state: {
        crud: x
      }
    }
    this.router.navigate(['/editar'], navigationsExtras);


  }
  eliminar(x:any){
    this.bd.eliminarCrud(x.idCrud);
  }

  agregar(){
    this.router.navigate(['/agregar']);
  }

}
  */

import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.page.html',
  styleUrls: ['./eliminar.page.scss'],
})
export class EliminarPage implements OnInit {
  categorias: any[] = [];
  Crud: any[] = [];
  categoriaSeleccionada: number | null = null;
  nombreCategoriaSeleccionada: string = '';

  constructor(private alertController: AlertController, private bd: ServiceBDService, private router: Router) { }

  ngOnInit() {
    this.bd.dbState().subscribe(ready => {
      if (ready) {
        this.cargarCategorias();
      }
    });
  }

  cargarCategorias() {
    this.bd.fetchCategoria().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarCrudPorCategoria(idCategoria: number) {
    this.categoriaSeleccionada = idCategoria;
    this.nombreCategoriaSeleccionada = this.categorias.find(
      cat => cat.idCategoria === idCategoria
    )?.nomCateg || '';
    
    this.bd.fetchCrud().subscribe(Crud => {
      this.Crud = Crud.filter(Crud => 
        Crud.idCategoria === idCategoria
      );
    });
  }

  volverACategorias() {
    this.categoriaSeleccionada = null;
    this.Crud = [];
  }

  //////////////////////////

  modificar(Crud:any){
    let navigationsExtras: NavigationExtras = {
      state: {
        crud: Crud
      }
    }
    this.router.navigate(['/editar'], navigationsExtras);


  }

  agregar() {
    this.router.navigate(['/agregar']);
  }

  // Método para eliminar un Crud
  eliminar(idcrud:any){
    this.bd.eliminarCrud(idcrud.idCrud);
  }
  

  // Método para mostrar alertas
  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
