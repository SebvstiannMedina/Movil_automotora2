import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  nombre: string= ""; 
  email: string= "";
  contrasena: string= "";

    // Validacion nombre
  validarNombre(): boolean {
    const nameRegex = /^[a-zA-ZÀ-ÿÑñáéíóúÁÉÍÓÚüÜ ]+$/; 
    const longitudMinima = 3;
    return this.nombre.length >= longitudMinima && nameRegex.test(this.nombre);
  }

  // Alertas
  async presentAlert() {
    if (!this.nombre) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay nada que editar',
        buttons: ['OK'],
      });
      await alert.present();
    } else if (!this.validarNombre()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El nombre debe contener al menos 3 letras y no debe incluir números.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'EDITADO',
        message: 'Perfil fue editado',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  constructor(private router:Router, private activateroute:ActivatedRoute,  private alertController: AlertController) {
      //subscirbirnos a la lectura de los parametros
      this.activateroute.queryParams.subscribe(param =>{
        //valido si viene o no información en la ruta
        
        if(this.router.getCurrentNavigation()?.extras.state){
          this.nombre =this.router.getCurrentNavigation()?.extras?.state?.['nom'];
          this.email =this.router.getCurrentNavigation()?.extras?.state?.['em'];
          this.contrasena =this.router.getCurrentNavigation()?.extras?.state?.['con'];
          console.log("si pasa")
        }else{
          console.log("no pasa ")
        }
      })
   }

  ngOnInit() {
  }
  volver() {

    this.router.navigate(['/home']);
    this.presentAlert();
   
  }


}
