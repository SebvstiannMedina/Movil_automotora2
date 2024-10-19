import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite y SQLiteObject

@Component({
  selector: 'app-llanta',
  templateUrl: './llanta.page.html',
  styleUrls: ['./llanta.page.scss'],
})
export class LlantaPage implements OnInit {
  // Definir el array de productos
  products: any[] = [];
  cart: any[] = [];

  // Base de datos SQLite
  database: SQLiteObject | null = null;  // Inicializar como null

  constructor(
    private navCtrl: NavController, 
    private sqlite: SQLite // Inyecta el servicio SQLite
  ) {}

  ngOnInit() {
    // Inicializar la base de datos
    this.sqlite.create({
      name: 'automotora.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      console.log('Base de datos creada con éxito');
      this.createTable(); // Crear tabla si no existe
      this.insertllantas(); // Insertar productos si la tabla está vacía
      this.seleccionarCrud(); // Cargar productos
    }).catch(e => {
      console.log('Error al crear la base de datos', e);
    });
  }

  // Crear tabla si no existe
  createTable() {
    if (this.database) {
      this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS crud (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          descripcion TEXT,
          imagen TEXT,
          precio INTEGER,
          idCategoria INTEGER
        );`, [])
        .then(() => {
          console.log('Tabla "crud" creada o ya existe');
        })
        .catch(e => {
          console.log('Error al crear la tabla', e);
        });
    }
  }

  // Insertar productos en la tabla
  insertllantas() {
    if (this.database) {
      this.database.executeSql(`
        INSERT OR IGNORE INTO crud (nombre, descripcion, imagen, precio, idCategoria) VALUES 
        ('Llantas Aro 14', 'Llantas modelo ABC para la nueva generación.', 'https://http2.mlstatic.com/D_NQ_NP_967638-MLC72433186153_102023-O.webp', 120000, 1),
        ('Llantas Doradas', 'Llantas de alto rendimiento para vehículos deportivos.', 'https://www.powercars.cl/wp-content/uploads/2023/03/LL1448.jpg', 200000, 1),
        ('Llantas Estrella', 'Llantas diseñadas para mejorar el rendimiento en nieve y hielo.', 'https://http2.mlstatic.com/D_NQ_NP_604467-MLC76047911844_052024-O.webp', 150000, 1),
        ('Llantas Aro 15', 'Llantas aro 15 modelo negro ligera para mejorar la apariencia y el rendimiento.', 'https://ventastore.cl/wp-content/uploads/2023/12/DSC7895.jpg', 250000, 1);
      `, [])
        .then(() => {
          console.log('Llantas insertadas correctamente');
          this.seleccionarCrud(); // Refrescar listado de productos
        })
        .catch(e => console.log('Error al insertar llantas', e));
    }
  }

  // Seleccionar productos desde la base de datos
  seleccionarCrud() {
    if (this.database) {
      this.database.executeSql('SELECT * FROM crud', []).then(res => {
        this.products = [];
        for (let i = 0; i < res.rows.length; i++) {
          this.products.push(res.rows.item(i));
        }
        console.log('Productos cargados:', this.products);
      })
      .catch(e => {
        console.log('Error al cargar productos', e);
      });
    }
  }

  // Añadir producto al carrito
  addToCart(product: any) {
    const existingProduct = this.cart.find(item => item.nombre === product.nombre);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  // Eliminar producto del carrito
  removeFromCart(product: any) {
    this.cart = this.cart.filter(item => item.nombre !== product.nombre);
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
  }

  // Navegar al carrito de compras
  goToCart() {
    this.navCtrl.navigateForward('/carrito-compra', {
      state: { cart: this.cart }
    });
  }
}
