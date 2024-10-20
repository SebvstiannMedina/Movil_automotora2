import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  //Typescript:

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  objetoLogin = {
    correo: '',
    contrasena: ''
  };

  rol! : number;

  constructor(private router: Router, private alertController: AlertController, private bd: ServiceBDService, private storage: NativeStorage) { this.storage.clear(); }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'LOGIN',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  login() {
    const { correo, contrasena} = this.objetoLogin;

    // Verificar credenciales con la base de datos
    this.bd.isDBReady.subscribe(async (val) => {
      if (val) {

        this.storage.clear();

        const validar = await this.bd.validarCredenciales(correo, contrasena);
        if (validar) {
          const usuarioStorage = await this.bd.guardarTipoStorage(correo, contrasena);
          const { idusuario, id_Rol, nombre } = usuarioStorage[0]; // Desestructuramos para obtener id_usuario y rol_id_rol
          this.storage.setItem('Id', idusuario); // Asegúrate de que sean strings si es necesario
          this.storage.setItem('Rol', id_Rol); // Asegúrate de que sean strings si es necesario
          this.storage.setItem('Nombre', nombre); // Asegúrate de que sean strings si es necesario
          this.router.navigate(['/home']);
          this.presentAlert("ver datos" + idusuario + id_Rol + nombre); // id = 1 || rol = 1 + nombre = user
          console.log('Login exitoso:', this.objetoLogin);
          this.presentAlert('Login exitoso');
          // Redirigir según el rol seleccionado

          this.router.navigate(['/home']);
        }
      } else {
        console.log('Login fallido');
        this.presentAlert('Email o contraseña incorrectos');
      }
    });
  }


  // Método para redirigir según el rol
  redirigirSegunRol(rol: string) {
    if (rol === 'cliente') {
      this.router.navigate(['/eliminar']);  // Página para clientes

    } else if (rol === 'vendedor') {
      this.router.navigate(['/home']);  // Página para vendedores

    } else {
      this.presentAlert('Seleccione un rol válido');
    }
  }

  ngOnInit() { 
    this.storage.clear();
  }
}
