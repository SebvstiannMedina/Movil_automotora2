import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  //variable de conexión a la base de datos

  public database!: SQLiteObject;

  //variable para tablas
  //crear una variable por tabla que exista en nuestra aplicacion


  constructor() { }
}
