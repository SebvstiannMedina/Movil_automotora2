import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { CartService, CartItem  } from 'src/app/service/cart.service';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss'],
})
export class CarritoCompraPage implements OnInit {
  cartItems: CartItem[] = [];
  id_user: number = 0;
  username: string = '';
  email: string = '';
  total: number = 0;

  constructor(
    private cartService: CartService,
    private alertController: AlertController,
    private router: Router,
    private bd: ServiceBDService,
    private cdr : ChangeDetectorRef,
    private storage : NativeStorage
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  async ionViewWillEnter() {
    try {
      // Obtener el ID del usuario desde el almacenamiento y convertirlo a número
      const userIdString = await this.storage.getItem('Id'); // Recupera el ID como string
      const userId = userIdString ? parseInt(userIdString, 10) : null; // Convierte a número si existe
  
      if (userId && !isNaN(userId)) {
        this.id_user = userId;
  
        // Buscar datos del usuario
        const userData = await this.bd.searchUserById(userId);
        if (userData) {
          this.username = userData.nombre;
          this.email = userData.correo;
        }
  
        // Inicializar el carrito para el usuario logueado
        await this.cartService.setCurrentUser(userId);
  
        // Obtener el contenido actual del carrito
        this.cartService.getCartItems().subscribe((items) => {
          this.cartItems = items;
          this.total = items.reduce((sum, item) => sum + item.subtotal, 0);
          this.cdr.detectChanges(); // Actualizar la vista
        });
      } else {
        console.error("El ID del usuario no es válido o no está almacenado.");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario o el carrito:", error);
    }
  }

  async updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      try {
        await this.cartService.updateQuantity(item.product.idCrud, newQuantity);
      } catch (error) {
        // Mostrar alerta si no hay suficiente stock
        await this.presentStockErrorAlert(item.product.stock);
      }
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
    } catch (error: unknown) {
      // Verificación más genérica
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('no tiene suficiente stock')) {
          await this.presentStockCheckoutErrorAlert();
          return;
        }
      }
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

  // Nueva alerta para manejar errores de stock al modificar cantidad
  async presentStockErrorAlert(availableStock: number) {
    const alert = await this.alertController.create({
      header: 'Stock Insuficiente',
      message: `Lo sentimos, solo hay ${availableStock} unidades disponibles.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Nueva alerta para manejar errores de stock al hacer checkout
  async presentStockCheckoutErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error de Stock',
      message: 'Algunos productos en tu carrito no tienen suficiente stock. Por favor, revisa las cantidades.',
      buttons: ['OK']
    });
    await alert.present();
  }
}