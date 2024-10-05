import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'login',
      message: 'Bienvenido',
      buttons: ['ok'],
    });

    await alert.present();
    
  }
  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'login ',
      message: 'algun dato esta incorrecto',
      buttons: ['ok'],
    });

    await alert.present();
    
  }
   // Definir el objeto para almacenar los datos del formulario
   formData = {
    email: '',
    contrasena: ''
  };

  // Objetos de ejemplo con los cuales comparar

  objetoComparacion2 = {
    nombre: 'admin',
    email: 'admin@gmail.com',
    contrasena: 'admin1234'
  };  

///Recoqe los datos interpolados
  objetoRegistro = {
    email: '',
    contrasena: ''
  };
  
  constructor(private router: Router,private alertController: AlertController) {
    ///este  recoge los datos interpolados,¿porque? -pues porque asi lo pide la rubrica :v jajjaja
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['objetoRegistro']) {
      this.objetoRegistro = navigation.extras.state['objetoRegistro'];
      console.log("si llego el registro");
    }else{
      console.log("wajapen? no llego");
      return;
    }
  }

  registrar() {
      // Verificar los datos que esten en los objetos, pero ya funcionando todo no necesary
  
    console.log('formData:', this.formData);
    console.log('objetoComparacion2:', this.objetoComparacion2);
    console.log('objetoRegistro:', this.objetoRegistro);
 
    // Comparar con el admin
    const administrador = this.compararObjetos(this.formData, this.objetoComparacion2);
    // Para el usuario registrado interpolado
    const usuarioPolado = this.objetoRegistro.email && this.compararObjetos(this.formData, this.objetoRegistro);

    if (administrador) {
      this.router.navigate(['/agregar']);
      this.presentAlert();
    } else if (usuarioPolado) {
      this.router.navigate(['/home']);
      this.presentAlert();
    } else {
      //por si no esta registrao
      this.router.navigate(['/login']);
      this.presentAlert2();
      console.log('Los datos no coinciden con ninguno de los objetos');
    }
  }

  compararObjetos(obj1: any, obj2: any): boolean {
    return obj1.email === obj2.email &&
           obj1.contrasena === obj2.contrasena;
  }

  ngOnInit():void {
  }

  irPagina() {
    this.router.navigate(['/recupera-contra']);
    this.router.navigate(['/registro']);
  }
}
