import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.page.html',
  styleUrls: ['./ver-perfil.page.scss'],
})
export class VerPerfilPage implements OnInit {
  
  nombre:string = "user";
  email:string = "user@gmail.com";
  contrasena:string = " user1234*";

  constructor(private router:Router) { }

  ngOnInit() {
  }

  irPagina(){
  let  navigationextras:NavigationExtras ={

    state:{
      nom:this.nombre,
      em : this.email,
      con: this.contrasena
    }
  }
  
  this.router.navigate(['/editar-perfil'],navigationextras);
  }


}
