import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  objetoLogin = {
    correo: '',
    contrasena: '',
    rol: ''  // Nuevo campo para almacenar el rol
  };

  constructor(private router: Router, private alertController: AlertController, private bd: ServiceBDService) { }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'LOGIN',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  login() {
    const { correo, contrasena, rol } = this.objetoLogin;

    // Verificar credenciales con la base de datos
    this.bd.validarCredenciales(correo, contrasena).then(isValid => {
      if (isValid) {
        console.log('Login exitoso:', this.objetoLogin);
        this.presentAlert('Login exitoso');
        // Redirigir según el rol seleccionado
        this.redirigirSegunRol(rol);
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

  ngOnInit() {}
}
