import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss'],
})
export class CarritoCompraPage implements OnInit {
  products: any[] = []; // Suponiendo que tus productos se almacenan aquí
  cart: any[] = []; // Inicialización del carrito

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Acceder al estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras['state']) {
      this.cart = navigation.extras['state']['cart'] || []; // Acceso usando notación de índice
    }
  }

  addToCart(product: any) {
    // Lógica para añadir producto al carrito
    this.cart.push(product);
  }

  removeFromCart(product: any) {
    // Elimina un producto del carrito
    this.cart = this.cart.filter(item => item.nombre !== product.nombre);
  }

  clearCart() {
    // Vacía el carrito
    this.cart = [];
  }

  getTotal() {
    return this.cart.reduce((acc, product) => acc + (product.precio * product.quantity), 0);
  }

  goToCart() {
    this.router.navigate(['/carrito-compra'], {
      state: { cart: this.cart } // Pasa el carrito al navegar
    });
  }
}
