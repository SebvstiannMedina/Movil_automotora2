import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite y SQLiteObject
import { CartService, CartItem  } from 'src/app/service/cart.service';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-aeromatizantes',
  templateUrl: './aeromatizantes.page.html',
  styleUrls: ['./aeromatizantes.page.scss'],
})
export class AeromatizantesPage implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private alertController: AlertController,
    private router: Router,
    service: ServiceBDService
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.product.idCrud, newQuantity);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.idCrud);
  }

  clearCart() {
    this.presentAlertConfirm();
  }

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getTotal(): number {
    return this.getSubtotal(); // Puedes agregar impuestos o descuentos aquí
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas vaciar el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cartService.clearCart();
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    try {
      await this.cartService.checkout();
      this.presentSuccessAlert();
    } catch (error) {
      this.presentErrorAlert();
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Tu compra se ha procesado correctamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/home']); // O donde quieras redirigir
        }
      }]
    });
    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al procesar tu compra. Por favor, intenta nuevamente.',
      buttons: ['OK']
    });
    await alert.present();
  }
}