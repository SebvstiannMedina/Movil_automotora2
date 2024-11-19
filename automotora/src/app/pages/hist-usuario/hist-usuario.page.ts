import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-hist-usuario',
  templateUrl: './hist-usuario.page.html',
  styleUrls: ['./hist-usuario.page.scss'],
})
export class HistUsuarioPage implements OnInit {

  AllUsers: any = [
    {
      idusuario: '',
      nombre: '',
      correo: '',
      imagen:'',
      idRol:'',
     
    }
  ];

  constructor(
    private alertController: AlertController, 
    private bd: ServiceBDService, 
    private router:Router) {
      this.bd.dbState().subscribe(data=>{
        //validar si la bd esta lista
        if(data){
          //subscribir al observable de la listaNoticias
          this.bd.fetchUsuario().subscribe(res=>{
            this.AllUsers = res;
          })
        }
      })
     }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchUsuario().subscribe(res=>{
          this.AllUsers = res;
        })
      }
    })
  }

}
