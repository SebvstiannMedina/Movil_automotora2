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
    contrasena: ''
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
    const { correo, contrasena } = this.objetoLogin;

    this.bd.validarCredenciales(correo, contrasena).then(isValid => {
      if (isValid) {
        console.log('Login exitoso:', this.objetoLogin);
        this.presentAlert('Login exitoso');
        // Redirigir a la página de inicio u otra
        this.router.navigate(['/home']);
      } else {
        console.log('Login fallido');
        this.presentAlert('Email o contraseña incorrectos');
      }
    });
  }

  ngOnInit() {}
}
