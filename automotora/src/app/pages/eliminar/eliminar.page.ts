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
  
  arreglocrud: any = [
    {
      id: '',
      nombre: '',
      descripcion: '',
      imagen:'',
      precio:'',
      idCategoria:''
    }
  ]
/*
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'AGREGAR ',
      message: 'Producto fue agregado',
      buttons: ['ok'],
    });

    await alert.present();
    
  }
*/

  constructor(private alertController: AlertController, private bd: ServiceBDService, private router:Router) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
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
    this.bd.eliminarCrud(x.idrud);
  }

  agregar(){
    this.router.navigate(['/agregar']);
  }

}