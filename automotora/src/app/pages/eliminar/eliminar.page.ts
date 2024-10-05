import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.page.html',
  styleUrls: ['./eliminar.page.scss'],
})
export class EliminarPage implements OnInit {
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'AGREGAR ',
      message: 'Producto fue agregado',
      buttons: ['ok'],
    });

    await alert.present();
    
  }
  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

}