import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceBDService } from './service-bd.service';
import { Crud } from './crud';

export interface CartItem {
  product: Crud;
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  private currentUserId: number | null = null;

  constructor(private dbService: ServiceBDService) {
    // Sincronizar el carrito con el localStorage
    this.cartItems.subscribe(items => {
      if (this.currentUserId !== null) {
        this.saveCartToLocalStorage(this.currentUserId, items);
      }
    });
  }

  // Establecer el usuario actual
  async setCurrentUser(userId: number) {
    this.currentUserId = userId;
    const userCart = this.loadCartFromLocalStorage(userId); // Cargar el carrito desde el localStorage
    this.cartItems.next(userCart); // Actualizar el carrito actual
  }

  // Obtener el contenido del carrito
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  // Añadir un producto al carrito
  addToCart(product: Crud, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.idCrud === product.idCrud);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * product.precio;
    } else {
      currentItems.push({
        product: product,
        quantity: quantity,
        subtotal: quantity * product.precio
      });
    }

    this.cartItems.next(currentItems);
  }

  // Remover un producto del carrito
  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.idCrud !== productId);
    this.cartItems.next(updatedItems);
  }

  // Actualizar la cantidad de un producto
  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.idCrud === productId);

    if (item) {
      item.quantity = quantity;
      item.subtotal = quantity * item.product.precio;
      this.cartItems.next(currentItems);
    }
  }

  // Obtener el total del carrito
  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.subtotal, 0);
  }

  // Limpiar el carrito
  clearCart() {
    this.cartItems.next([]);
    if (this.currentUserId !== null) {
      this.saveCartToLocalStorage(this.currentUserId, []); // Limpiar también en localStorage
    }
  }

  // Procesar la compra
  async checkout() {
    if (!this.currentUserId) {
      throw new Error('No hay usuario activo');
    }

    try {
      const total = this.getTotal();

      // Crear la venta principal
      await this.dbService.insertarVenta(
        total,
        this.currentUserId,
        total, // subtotal igual al total si no hay descuentos
        this.cartItems.value[0]?.product.idCrud || 0 // referencia al primer producto
      );

      // Obtener el ID de la última venta
      const ventas = await this.dbService.database.executeSql(
        'SELECT MAX(idVenta) as lastId FROM venta WHERE idusuario = ?',
        [this.currentUserId]
      );
      const ventaId = ventas.rows.item(0).lastId;

      // Crear los detalles de la venta
      for (const item of this.cartItems.value) {
        await this.dbService.insertarDetalle(
          ventaId,
          item.product.idCrud,
          item.quantity,
          item.subtotal
        );
      }

      // Limpiar el carrito después de la compra exitosa
      this.clearCart();

      return true;
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      throw error;
    }
  }

  // Guardar el carrito en el localStorage
  private saveCartToLocalStorage(userId: number, items: CartItem[]) {
    try {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }

  // Cargar el carrito desde el localStorage
  private loadCartFromLocalStorage(userId: number): CartItem[] {
    try {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
      return [];
    }
  }
}