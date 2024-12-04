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
  private currentUserId!: number ;

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

  // Añadir un producto al carrito con validación de stock
  async addToCart(product: Crud, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.idCrud === product.idCrud);

    // Calcular la cantidad total del producto en el carrito
    const totalQuantityInCart = existingItem 
      ? existingItem.quantity + quantity 
      : quantity;

    // Verificar si hay suficiente stock
    if (totalQuantityInCart > product.stock) {
      throw new Error(`No hay suficiente stock. Stock disponible: ${product.stock}`);
    }

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

  // Actualizar la cantidad de un producto con validación de stock
  async updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.idCrud === productId);

    if (item) {
      // Verificar si hay suficiente stock
      if (quantity > item.product.stock) {
        throw new Error(`No hay suficiente stock. Stock disponible: ${item.product.stock}`);
      }

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

  // Procesar la compra con actualización de stock
  async checkout() {
    if (!this.currentUserId) {
      throw new Error('No hay usuario activo');
    }

    try {
      const total = this.getTotal();

      // Verificar stock antes de procesar la compra
      for (const item of this.cartItems.value) {
        if (item.quantity > item.product.stock) {
          throw new Error(`El producto ${item.product.idCrud} no tiene suficiente stock`);
        }
      }

      // Crear la venta principal
      const ventaResult = await this.dbService.insertarVenta(
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

      // Crear los detalles de la venta y actualizar stock
      for (const item of this.cartItems.value) {
        // Insertar detalle de venta
        await this.dbService.insertarDetalle(
          ventaId,
          item.product.idCrud,
          item.quantity,
          item.subtotal
        );

        // Actualizar stock del producto
        await this.dbService.actualizarStock(  item.product.idCrud, item.quantity);
        
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