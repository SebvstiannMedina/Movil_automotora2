import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Crud } from './crud';
import { Usuario } from './usuario';
import { Venta } from './venta';
import { Rol } from './rol';
import { Categoria } from './categoria';
import { Detalles } from './detalles';
import { Estados } from './estados';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  public database!: SQLiteObject;

 
  /*-------------------------------------------------------------  // Creación de tablas */
  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS categoria(idCategoria INTEGER PRIMARY KEY AUTOINCREMENT, nomCateg VARCHAR(100) NOT NULL);";
  
  tablaCrud: string = "CREATE TABLE IF NOT EXISTS crud(idcrud INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, descripcion VARCHAR(250) NOT NULL, imagen BLOB, precio INTEGER NOT NULL, idCategoria INTEGER NOT NULL, FOREIGN KEY(idCategoria) REFERENCES categoria(idCategoria));";
  
  tablaDetalles: string = "CREATE TABLE IF NOT EXISTS detalles(idDetalle INTEGER PRIMARY KEY AUTOINCREMENT, idVenta INTEGER NOT NULL, idProducto INTEGER NOT NULL, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL, FOREIGN KEY(idVenta) REFERENCES venta(idVenta), FOREIGN KEY(idProducto) REFERENCES crud(idcrud));";
  
  tablaEstados: string = "CREATE TABLE IF NOT EXISTS estados(idEstado INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  
  tablaVenta: string = "CREATE TABLE IF NOT EXISTS venta(idVenta INTEGER PRIMARY KEY AUTOINCREMENT, total INTEGER NOT NULL, idusuario INTEGER NOT NULL, subtotal INTEGER NOT NULL, idCrud INTEGER NOT NULL, FOREIGN KEY(idusuario) REFERENCES usuario(idusuario), FOREIGN KEY(idCrud) REFERENCES crud(idcrud));";
  
  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol(idRol INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(250), correo VARCHAR(250), imagen BLOB, contrasena VARCHAR(250), id_Rol INTEGER, FOREIGN KEY(id_Rol) REFERENCES rol(idRol));";

  
  /*-------------------------------------------------------------  // Listado de Observables */
  
  // Listado de Observables
  listadoCrud = new BehaviorSubject<Crud[]>([]);
  listadoUsuario = new BehaviorSubject<Usuario[]>([]);
  listadoVenta = new BehaviorSubject<Venta[]>([]);
  listadoRol = new BehaviorSubject<Rol[]>([]);
  listadoCategoria = new BehaviorSubject<Categoria[]>([]);
  listadoDetalles = new BehaviorSubject<Detalles[]>([]);
  listadoEstados = new BehaviorSubject<Estados[]>([]);
  /*lo de arriba reemplaza a lo de abajo
   registroCrud: string = "INSERT or IGNORE INTO crud(idcrud, nombre, descripcion, imagen, precio, categoria) VALUES ('1','nombre','descripcion', 'imagen', '10','1' )";
   listadoCrud = new BehaviorSubject([]);
  */
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createBD(); // Crea BD Crud

  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  fetchcrud(): Observable<Crud[]> {
    return this.listadoCrud.asObservable();
  }
  fetchUsuario(): Observable<Usuario[]> {
    return this.listadoUsuario.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  createBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'crud.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.crearTablas();
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      });
    });
  }
/*-------------------------------------------------------------  // Crear tablas */
  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaCategoria, []);
      await this.database.executeSql(this.tablaCrud, []);
      await this.database.executeSql(this.tablaDetalles, []);
      await this.database.executeSql(this.tablaEstados, []);
      await this.database.executeSql(this.tablaVenta, []);
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaUsuario, []);
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }
  /*-------------------------------------------------------------  // Queries crud */
  seleccionarCrud() {
    return this.database.executeSql('SELECT * FROM crud', []).then(res => {
      let items: Crud[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idcrud: res.rows.item(i).idcrud,
            nombre: res.rows.item(i).nombre,
            descripcion: res.rows.item(i).descripcion,
            imagen: res.rows.item(i).imagen,
            precio: res.rows.item(i).precio,
            idcategoria: res.rows.item(i).idCategoria 
          });
        }
      }
      this.listadoCrud.next(items);
    });
  }

  eliminarCrud(id: string) {
    return this.database.executeSql('DELETE FROM crud WHERE idcrud = ?', [id]).then(res => {
      this.presentAlert("Eliminar", "Producto Eliminado");
      this.seleccionarCrud();
    }).catch(e => {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    });
  }

  modificarCrud(id: string, nombre: string, descripcion: string, imagen: any, precio: number, idcategoria: number) {
    return this.database.executeSql('UPDATE crud SET nombre = ?, descripcion = ?, imagen = ?, precio = ?, idCategoria = ? WHERE idcrud = ?', [nombre, descripcion, imagen, precio, idcategoria, id]).then(res => {
      this.presentAlert("Modificar", "Producto Modificado");
      this.seleccionarCrud();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }

  insertarCrud(nombre: string, descripcion: string, imagen: any, precio: number, idcategoria: number) {
    return this.database.executeSql('INSERT INTO crud(nombre, descripcion, imagen, precio, idCategoria) VALUES (?, ?, ?, ?, ?)', [nombre, descripcion, imagen, precio, idcategoria]).then(res => {
      this.presentAlert("Insertar", "Producto Registrado");
      this.seleccionarCrud();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }
  /*-------------------------------------------------------------  // Queries usuario */
  seleccionarUsuario() {
    return this.database.executeSql('SELECT * FROM usuario', []).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idusuario: res.rows.item(i).idusuario,
            nombre: res.rows.item(i).nombre,
            correo: res.rows.item(i).correo,
            imagen: res.rows.item(i).imagen,
            contrasena: res.rows.item(i).contrasena,
            idRol: res.rows.item(i).id_Rol
          });
        }
      }
      this.listadoUsuario.next(items);
    });
  }
  
  modificarUsuario(id: string, nombre: string, correo: string, imagen: any) {
    return this.database.executeSql('UPDATE usuario SET nombre = ?, correo = ?, imagen = ? WHERE idusuario = ?', [nombre, correo, imagen, id]).then(res => {
      this.presentAlert("insert","Entra");
      this.presentAlert("Modificar", "Usuario Modificado");
      this.seleccionarUsuario();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }
  modificarContrasena(id: string, contrasena: string,) {
    return this.database.executeSql('UPDATE usuario SET  contrasena = ? WHERE idusuario = ?', [contrasena, id]).then(res => {
      this.presentAlert("Modificar Contraseña", "Usuario Modificado");
      this.seleccionarUsuario();
    }).catch(e => {
      this.presentAlert('Modificar Contraseña', 'Error: ' + JSON.stringify(e));
    });
  }
  
  insertarUsuario(nombre: string, correo: string,  contrasena: string, idRol: number, imagen: any) {
    return this.database.executeSql('INSERT INTO usuario(nombre, correo,  contrasena, id_Rol , imagen) VALUES (?, ?, ?, ?, ? )', [nombre, correo,  contrasena, idRol, imagen]).then(res => {
      this.presentAlert("Insertar", "Usuario Registrado");
      this.seleccionarUsuario();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }

  //compara la base de datos 
  obtenerUsuarios() {
    return this.listadoUsuario;
  }

  validarCredenciales(correo: string, contrasena: string): Promise<boolean> {
    return this.database.executeSql('SELECT * FROM usuario WHERE correo = ? AND contrasena = ?', [correo, contrasena])
      .then(res => {
        return res.rows.length > 0; 
      }).catch(e => {
        console.error('Error al validar credenciales:', e);
        return false;
      });
  }
}
  /*-------------------------------------------------------------  // Queries venta */  

