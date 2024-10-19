import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite y SQLiteObject

@Component({
  selector: 'app-aeromatizantes',
  templateUrl: './aeromatizantes.page.html',
  styleUrls: ['./aeromatizantes.page.scss'],
})
export class AeromatizantesPage implements OnInit {
  // Definir el array de productos
  products: any[] = [];
  cart: any[] = [];

  // Base de datos SQLite
  database: SQLiteObject | null = null; // Inicializar como null

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
      this.insertAeromatizantes(); // Insertar productos si la tabla está vacía
      this.selectAeromatizantes(); // Cargar productos
    }).catch(e => {
      console.log('Error al crear la base de datos', e);
    });
  }

  // Crear tabla si no existe
  createTable() {
    if (this.database) {
      this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS aeromatizantes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          descripcion TEXT,
          imagen TEXT,
          precio INTEGER
        );`, [])
        .then(() => {
          console.log('Tabla "aeromatizantes" creada o ya existe');
        })
        .catch(e => {
          console.log('Error al crear la tabla', e);
        });
    }
  }

  // Insertar productos en la tabla
  insertAeromatizantes() {
    if (this.database) {
      this.database.executeSql(`
        INSERT OR IGNORE INTO aeromatizantes (nombre, descripcion, imagen, precio) VALUES 
        ('Aromatizante Glade Auto Esencia Auto Nuevo', 'Aeromatizante Glade.', 'https://easycl.vtexassets.com/arquivos/ids/300411/1152016-03.jpg?v=637530216465300000', 12000),
        ('Little Trees Pino Aromatizante Royal Pine 1 Unid', 'Aeromatizante Little Trees Pino', 'https://santaisabel.vtexassets.com/arquivos/ids/177985/Aromatizante-para-Auto-Little-Trees-Pino-1-Unidad.jpg?v=637635341246600000', 200000),
        ('Ambientador Auto Frutos Rojos 8 ml', 'Ambientador Auto Frutos Rojos 8 ml', 'https://cdnx.jumpseller.com/jardindehadas/image/11817055/Ambientador-Auto-Frutos-Rojos-8-ml-Boles-d-olor-8432097083734.jpg?1603486397', 5800),
        ('Pack 3 Aromatizantes Auto Deosol Variedad De Aromas', 'Aeromatizantes tree pack, variedades', 'https://http2.mlstatic.com/D_NQ_NP_900664-MLC52802648376_122022-O.webp', 10990);
      `, [])
        .then(() => {
          console.log('Aeromatizantes insertados correctamente');
          this.selectAeromatizantes(); // Refrescar listado de productos
        })
        .catch(e => console.log('Error al insertar aeromatizantes', e));
    }
  }

  // Seleccionar productos desde la base de datos
  selectAeromatizantes() {
    if (this.database) {
      this.database.executeSql('SELECT * FROM aeromatizantes', []).then(res => {
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
