import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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

  rol!: number;

  constructor(private router: Router, private alertController: AlertController, private bd: ServiceBDService, private storage: NativeStorage,
    private cdr: ChangeDetectorRef
  ) { 
    // Eliminamos la llamada a this.storage.clear() del constructor
  }

  // Verificar si ya hay sesión activa cuando el componente se inicializa
  ngOnInit() { 
    this.storage.getItem('Id').then((id) => {
      if (id) {
        // El usuario ya está logueado, redirige al home
        this.router.navigate(['/home']);
      }else{
        this.storage.clear(); // Limpiamos el almacenamiento antes de iniciar sesión
        this.cdr.detectChanges();
      }
    }).catch(error => {
      // Si no se encuentra el item o ocurre un error, continúa con el login
      console.log('Usuario no logueado o error al obtener los datos');
    });
  }

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

    // Verificar credenciales con la base de datos
    this.bd.isDBReady.subscribe(async (val) => {
      if (val) {

       
        const validar = await this.bd.validarCredenciales(correo, contrasena);
        if (validar) {
          const usuarioStorage = await this.bd.guardarTipoStorage(correo, contrasena);
          const { idusuario, id_Rol, nombre } = usuarioStorage[0]; // Desestructuramos para obtener id_usuario y rol_id_rol
          this.storage.setItem('Id', idusuario); // Asegúrate de que sean strings si es necesario
          this.storage.setItem('Rol', id_Rol); // Asegúrate de que sean strings si es necesario
          this.storage.setItem('Nombre', nombre); // Asegúrate de que sean strings si es necesario
          //aqui deben rellenar el observable de usuario
          this.limpiarFormulario();
          this.router.navigate(['/home']);
          ///this.presentAlert("ver datos " + idusuario + id_Rol + nombre); // id = 1 || rol = 1 + nombre = user
          console.log('Login exitoso:', this.objetoLogin);
          ///this.cdr.detectChanges();
          //this.bd.presentAlert("Bienvenido",`  ${await this.storage.getItem("Nombre")}`);
          this.bd.presentAlert("Bienvenido", `  ${nombre}`);
        }else {
         // console.log('Login fallido');
         // this.presentAlert('Email o contraseña incorrectos');
        }
        } else {
          //console.log('Login fallido');   
        }
    });
  }
  private limpiarFormulario() {
    this.objetoLogin.correo = '';
    this.objetoLogin.contrasena = '';
  }
}
