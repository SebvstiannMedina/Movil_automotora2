import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.page.html',
  styleUrls: ['./ver-perfil.page.scss'],
})
export class VerPerfilPage implements OnInit {
  arregloUsuario: any = [
    {
      idusuario:'',
      nombre:'',
      correo:'',
      imagen:'',
      contrasena:'',
      idRol:''
    }
  ]
 

  constructor(private router:Router, private bd: ServiceBDService) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchUsuario().subscribe(res=>{
          this.arregloUsuario = res;
        })
      }
    })
  }

  irPagina(x:any){
    let navigationsExtras: NavigationExtras = {
      state: {
        Usuario: x
      }
    }
    this.router.navigate(['/editar-perfil'],navigationsExtras);
  
  }


}
