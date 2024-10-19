import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite y SQLiteObject

@Component({
  selector: 'app-otros',
  templateUrl: './otros.page.html',
  styleUrls: ['./otros.page.scss'],
})
export class OtrosPage implements OnInit {
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
      this.insertOtros(); // Insertar productos si la tabla está vacía
      this.seleccionarCrud(); // Cargar productos
    }).catch(e => {
      console.log('Error al crear la base de datos', e);
    });
  }

  // Crear tabla si no existe
  createTable() {
    if (this.database) {
      this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS otros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          descripcion TEXT,
          imagen TEXT,
          precio INTEGER
        );`, [])
        .then(() => {
          console.log('Tabla "otros" creada o ya existe');
        })
        .catch(e => {
          console.log('Error al crear la tabla', e);
        });
    }
  }

  // Insertar productos en la tabla
  insertOtros() {
    if (this.database) {
      this.database.executeSql(`
        INSERT OR IGNORE INTO otros (nombre, descripcion, imagen, precio) VALUES 
        ('Espejo Retrovisor', 'Espejo Retrovisor universal convexo', 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/127181553_01/w=800,h=800,fit=pad', 24990),
        ('Led intermitente', 'X2 Ampolleta 144 Led Intermitente Py21 Pata En V 12v Ámbar', 'https://http2.mlstatic.com/D_NQ_NP_758773-MLC53781392571_022023-O.webp', 7664),
        ('Funda para asientos', 'Funda Cubre Asientos para Autos Negro con Tonos Grices MOMO', 'https://api.autoplanet.cl/medias/sys_master/images/hc9/h68/9633207287838/1054054_1-1682041641/1054054-1-1682041641.webp', 55000),
        ('Palanca de cambio', 'Articulacion Palanca Cambio Chevrolet Corsa 1.4 1.6 94 - 12', 'https://http2.mlstatic.com/D_NQ_NP_2X_607758-MLC73371013918_122023-F.webp', 28310);
      `, [])
        .then(() => {
          console.log('Productos insertados correctamente');
          this.seleccionarCrud(); // Refrescar listado de productos
        })
        .catch(e => console.log('Error al insertar productos', e));
    }
  }

  // Seleccionar productos desde la base de datos
  seleccionarCrud() {
    if (this.database) {
      this.database.executeSql('SELECT * FROM otros', []).then(res => {
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
