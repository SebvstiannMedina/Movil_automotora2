import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject  } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Crud } from './crud';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  public database!: SQLiteObject;  /*variable para acceder a la base de datos*/

  //////////// Creacion de tablas /////////////////////
  
  tablaCrud: string ="CREATE TABLE IF NOT EXISTS crud(idcrud INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, imagen blob, precio VARCHAR(15) NOT NULL, categoria integer);"
  tablaCategoria: string ="CREATE TABLE IF NOT EXISTS categoria(idCategoria INTEGER PRIMARY KEY autoincrement, nomCateg VARCHAR(100) NOT NULL);"
  tablaVenta: string ="CREATE TABLE IF NOT EXISTS venta(idVenta INTEGER PRIMARY KEY autoincrement, total VARCHAR(100) NOT NULL, idusuario number NOT NULL, fecha DATE NOT NULL);"
  tablaUsuario: string ="CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL, correo VARCHAR(100) NOT NULL, contrasena VARCHAR(100) NOT NULL, rol number NOT NULL);"
  tablaRol: string ="CREATE TABLE IF NOT EXISTS rol(idRol INTEGER PRIMARY KEY autoincrement, nomRol VARCHAR(100) NOT NULL);"
  //////////// Insertar tablas /////////////////////// 
 
  registroCrud: string = "INSERT or IGNORE INTO crud(idcrud, nombre, descripcion, imagen, precio, categoria) VALUES ('1','nombre','descripcion', 'imagen', '10','1' )";
  registroCategoria: string = "INSERT or IGNORE INTO categoria(idCategoria, nomCateg) VALUES ('1','nombre');";
  registroVenta: string = "INSERT or IGNORE INTO venta(idVenta, total, idusuario, fecha) VALUES ('1','10','1','2022-01-01');";
  registroUsuario: string = "INSERT or IGNORE INTO usuario(idusuario, nombre, correo, contrasena, rol) VALUES ('1','nombre','correo@gmail.com', '123456', '1' );"; 
  registroRol: string = "INSERT or IGNORE INTO rol(idRol, nomRol) VALUES ('1','Rol');";

  /*-----------------------------------------------------------------------------------  fin crear e instertar  tablas */
  
  //////////////////////  Listado de Observables
  listadoCrud = new BehaviorSubject([]);
  listadoUsuario = new BehaviorSubject([]);
  
  ////////////////////// Fin  Listado de Observables
   
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  ///////////////////// Constructor
  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {   
     this.createBD() /*creacion de la base de datos*/
     this.createBDUsuario(); /*creacion de la base de datos*/
  }
  /*-----------------------------------------------------------------------------------  incio Alerta*/
  async presentAlert(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }
  /*----------------------------------------------------------------------------------- fin Alerta */
  ////////////////////// Metodos para manipular los observables
  
  fetchcrud(): Observable<Crud[]>{
    return this.listadoCrud.asObservable();
  }

  fetchusuario(): Observable<Usuario[]>{
    return this.listadoUsuario.asObservable();
  }



  /*-----------------------------------------------------------------------------------  funciones para gestionar BD */
  dbState(){
    return this.isDBReady.asObservable();
  }
  /*----------------------------------------------------------------------------------- fin gestionar BD */
  
  
  /*-----------------------------------------------------------------------------------  funciones para crear BD */
  /////////// Crud
  createBD(){
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'crud.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.database = db;
        this.crearTablas();
      }).catch(e=>{
        this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      })
    })
  }

  /////////Usuario
  createBDUsuario(){
    this.sqlite.create({
      name: 'usuario.db',
      location: 'default'
    }).then((db: SQLiteObject)=>{
      this.database = db;
      this.crearTablas();
    }).catch(e=>{
      this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
    })
  }


  /*----------------------------------------------------------------------------------- fin crear BD */
  /*-----------------------------------------------------------------------------------  crear tablas */
  /////////// Crud
  async crearTablas(){
    try{
      await this.database.executeSql(this.tablaCrud, []);

      await this.database.executeSql(this.registroCrud, []);

      this.seleccionarCrud();
      this.isDBReady.next(true);

    }catch(e){
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }
  /////// Usuario
  async crearTablasUsuario(){
    try{      
      await this.database.executeSql(this.tablaUsuario, []);
      await this.database.executeSql(this.registroUsuario, []);
      this.seleccionarUsuario();
      this.isDBReady.next(true);
    }catch(e){
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  /*----------------------------------------------------------------------------------- fin crear tablas */
  /*-----------------------------------------------------------------------------------  seleccionar */
  //////Crud
  seleccionarCrud(){
    return this.database.executeSql('SELECT * FROM crud', []).then(res=>{
       let items: Crud[] = [];
       if(res.rows.length > 0){
        for(var i=0; i < res.rows.length; i++){
          items.push({
            idcrud: res.rows.item(i).idcrud,
            nombre: res.rows.item(i).nombre,
            descripcion: res.rows.item(i).descripcion,
            imagen: res.rows.item(i).imagen,
            precio: res.rows.item(i).precio,
            categoria: res.rows.item(i).categoria
          })
        }
        
       }
       this.listadoCrud.next(items as any);

    })
  }
  /////// Usuario
  seleccionarUsuario(){
    return this.database.executeSql('SELECT * FROM usuario', []).then(res=>{
       let items: Usuario[] = [];
       if(res.rows.length > 0){      
        for(var i=0; i < res.rows.length; i++){
          items.push({
            idusuario: res.rows.item(i).idusuario,
            nombre: res.rows.item(i).nombre,
            correo: res.rows.item(i).correo,
            contrasena: res.rows.item(i).contrasena,            
            idRol: res.rows.item(i).idRol
          })
        }
        
       }
       this.listadoUsuario.next(items as any);      
    })
  }
  

  /*----------------------------------------------------------------------------------- fin seleccionar */
  /*-----------------------------------------------------------------------------------  eliminar */
  eliminarCrud(id:string){
    return this.database.executeSql('DELETE FROM crud WHERE idcrud = ?',[id]).then(res=>{
      this.presentAlert("Eliminar","Producto Eliminado");
      this.seleccionarCrud();
    }).catch(e=>{
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }
  /*----------------------------------------------------------------------------------- fin eliminar */
  /*-----------------------------------------------------------------------------------  modificar */
  ////CRUD
  modificarCrud(id:string, nombre:string, descripcion: string, imagen:string, precio:number, categoria:string){
    this.presentAlert("service","ID: " + id);
    return this.database.executeSql('UPDATE crud SET nombre = ?, descripcion =?, imagen =?, precio =?, categoria =? WHERE idcrud = ?',[categoria,precio,imagen,descripcion,nombre,id])
    .then(res=>{
      this.presentAlert("Modificar","Producto Modificado");
      this.seleccionarCrud();
    }).catch(e=>{
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    })

  }
  /////// Usuario
  modificarUsuario(id:string, nombre:string, correo:string, contrasena:string){
    this.presentAlert("service","ID: " + id);
    return this.database.executeSql('UPDATE usuario SET nombre = ?, correo =?, contrasena =? WHERE idusuario = ?',[contrasena,correo,nombre,id])
    .then(res=>{
      this.presentAlert("Modificar","Usuario Modificado");
      this.seleccionarUsuario();
    }).catch(e=>{
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    })
  }
  /*----------------------------------------------------------------------------------- fin modificar */

  /*-----------------------------------------------------------------------------------  insertar */
  /////CRUD
  insertarCrud(nombre:string, descripcion: string, imagen:string, precio:number, categoria:string){
    return this.database.executeSql('INSERT INTO crud(nombre, descripcion, imagen, precio ,categoria) VALUES (?,?,?,?,?)',[categoria,precio,imagen,descripcion,nombre]).then(res=>{
      this.presentAlert("Insertar","Producto Registrado");
      this.seleccionarCrud();
    }).catch(e=>{
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    })
  }

  /////// Usuario
  insertarUsuario(nombre:string, correo:string, contrasena:string, rol:string){
    return this.database.executeSql('INSERT INTO usuario(nombre, correo, contrasena, rol) VALUES (?,?,?,?)',[rol,contrasena,correo,nombre]).then(res=>{
      this.presentAlert("Insertar","Usuario Registrado");
      this.seleccionarUsuario();
    }).catch(e=>{
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    })
  }
  /*----------------------------------------------------------------------------------- fin insertar */

}
