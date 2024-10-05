import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss'],
})
export class CarritoCompraPage implements OnInit {
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra ',
      message: 'Compra exitosa',
      buttons: ['ok'],
    });

    await alert.present();
    
  }

  constructor(private router:Router, private alertController: AlertController) { }

  ngOnInit() {
  } 
  
  volver() {

    this.router.navigate(['/home']);
    this.presentAlert();
   
  }


}
