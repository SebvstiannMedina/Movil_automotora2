import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject  } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Crud } from './crud';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  public database!: SQLiteObject;

  tablaCrud: string ="CREATE TABLE IF NOT EXISTS crud(idcrud INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, imagen TEXT NOT NULL, precio VARCHAR(15) NOT NULL, categoria VARCHAR(1) NOT NULL);"
  
  registroCrud: string = "INSERT or IGNORE INTO crud(idcrud, nombre, descripcion, imagen, precio, categoria) VALUES ('1','nombre','descripcion', 'imagen', '10','1' )";
  
  listadoCrud = new BehaviorSubject([]);

  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.createBD();
  }

  async presentAlert(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  //metodos para manipular los observables
  fetchcrud(): Observable<Crud[]>{
    return this.listadoCrud.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  //función para crear la Base de Datos
  createBD(){
    //varificar si la plataforma esta disponible
    this.platform.ready().then(()=>{
      //crear la Base de Datos
      this.sqlite.create({
        name: 'crud.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        //capturar la conexion a la BD
        this.database = db;
        //llamamos a la función para crear las tablas
        this.crearTablas();
      }).catch(e=>{
        this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      })
    })

  }

  async crearTablas(){
    try{
      //ejecuto la creación de Tablas
      await this.database.executeSql(this.tablaCrud, []);

      //ejecuto los insert por defecto en el caso que existan
      await this.database.executeSql(this.registroCrud, []);

      this.seleccionarCrud();
      //modifico el estado de la Base de Datos
      this.isDBReady.next(true);

    }catch(e){
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  seleccionarCrud(){
    return this.database.executeSql('SELECT * FROM crud', []).then(res=>{
       //variable para almacenar el resultado de la consulta
       let items: Crud[] = [];
       //valido si trae al menos un registro
       if(res.rows.length > 0){
        //recorro mi resultado
        for(var i=0; i < res.rows.length; i++){
          //agrego los registros a mi lista
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
       //actualizar el observable
       this.listadoCrud.next(items as any);

    })
  }

  eliminarCrud(id:string){
    return this.database.executeSql('DELETE FROM crud WHERE idcrud = ?',[id]).then(res=>{
      this.presentAlert("Eliminar","Producto Eliminado");
      this.seleccionarCrud();
    }).catch(e=>{
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    })
  }

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

  insertarCrud(nombre:string, descripcion: string, imagen:string, precio:number, categoria:string){
    return this.database.executeSql('INSERT INTO crud(nombre, descripcion, imagen, precio ,categoria) VALUES (?,?,?,?,?)',[categoria,precio,imagen,descripcion,nombre]).then(res=>{
      this.presentAlert("Insertar","Producto Registrado");
      this.seleccionarCrud();
    }).catch(e=>{
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    })
  }


}
