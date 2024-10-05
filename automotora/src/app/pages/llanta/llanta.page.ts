import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; // Importa NavController para la navegación

@Component({
  selector: 'app-llanta',
  templateUrl: './llanta.page.html',
  styleUrls: ['./llanta.page.scss'],
})
export class LlantaPage implements OnInit {
  // Definir el array de productos
  products = [
    {
      name: 'Llantas Aro 14',
      price: 120000,
      description: 'Llantas modelo ABC para la nueva generación.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_967638-MLC72433186153_102023-O.webp'
    },
    {
      name: 'LLantas Doradas',
      price: 200000,
      description: 'Llantas de alto rendimiento para vehículos deportivos.',
      image: 'https://www.powercars.cl/wp-content/uploads/2023/03/LL1448.jpg'
    },
    {
      name: 'Llantas Estrella',
      price: 150000,
      description: 'Llantas diseñadas para mejorar el rendimiento en nieve y hielo.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_604467-MLC76047911844_052024-O.webp'
    },
    {
      name: 'Llantas Aro 15',
      price: 250000,
      description: 'Llantas aro 15 modelo negro ligera para mejorar la apariencia y el rendimiento.',
      image: 'https://ventastore.cl/wp-content/uploads/2023/12/DSC7895.jpg'
    }
  ];

  // Array para almacenar productos del carrito
  cart: any[] = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  // Método para añadir productos al carrito
  addToCart(product: any) {
    const existingProduct = this.cart.find(item => item.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  // Navegar a la página de carrito de compras
  goToCart() {
    this.navCtrl.navigateForward('/carrito-compra', {
      state: { cart: this.cart }
    });
  }
}
