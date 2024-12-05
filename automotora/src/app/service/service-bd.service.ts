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
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  public database!: SQLiteObject;

  // Creación de tablas
  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS categoria(idCategoria INTEGER PRIMARY KEY AUTOINCREMENT, nomCateg VARCHAR(100) NOT NULL);";

  tablaCrud: string = "CREATE TABLE IF NOT EXISTS crud(idcrud INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, descripcion VARCHAR(250) NOT NULL, imagen BLOB, precio INTEGER NOT NULL, stock INTEGER NOT NULL, idCategoria INTEGER NOT NULL, FOREIGN KEY(idCategoria) REFERENCES categoria(idCategoria));";

  tablaDetalles: string = "CREATE TABLE IF NOT EXISTS detalles(idDetalle INTEGER PRIMARY KEY AUTOINCREMENT, idVenta INTEGER NOT NULL, idProducto INTEGER NOT NULL, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL, FOREIGN KEY(idVenta) REFERENCES venta(idVenta), FOREIGN KEY(idProducto) REFERENCES crud(idcrud));";
  
  tablaEstados: string = "CREATE TABLE IF NOT EXISTS estados(idEstado INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  
  tablaVenta: string = "CREATE TABLE IF NOT EXISTS venta(idVenta INTEGER PRIMARY KEY AUTOINCREMENT, total INTEGER NOT NULL, idusuario INTEGER NOT NULL, subtotal INTEGER NOT NULL, idCrud INTEGER NOT NULL, FOREIGN KEY(idusuario) REFERENCES usuario(idusuario), FOREIGN KEY(idCrud) REFERENCES crud(idcrud));";
  
  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol(idRol INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(250), correo VARCHAR(250), imagen BLOB, contrasena VARCHAR(250), id_Rol INTEGER, preguntaSeleccionada VARCHAR(250), respuestaSeguridad VARCHAR(250), token NUMBER, FOREIGN KEY(id_Rol) REFERENCES rol(idRol));";

  

  // Inserts predeterminados
  llantas: string = "INSERT or IGNORE INTO categoria(idCategoria, nomCateg) VALUES (1, 'Llantas')";
  aeromatizantes: string = "INSERT or IGNORE INTO categoria(idCategoria, nomCateg) VALUES (2, 'Aeromatizantes')";
  repuestos: string = "INSERT or IGNORE INTO categoria(idCategoria, nomCateg) VALUES (3, 'Repuestos')";
 
  registroCrud: string = "INSERT or IGNORE INTO crud( idcrud, nombre, descripcion, imagen, precio, stock, idCategoria) VALUES ( 9, 'Llanta A3', 'LLanta Aro A3', null, 6000, 10, 1)";
  registroCrud2: string = "INSERT or IGNORE INTO crud( idcrud, nombre, descripcion, imagen, precio, stock, idCategoria) VALUES ( 8, 'Aeromatizante', 'Aeromatizante de rosa', null, 9000, 10, 2)";
  registroCrud3: string = "INSERT or IGNORE INTO crud( idcrud, nombre, descripcion, imagen, precio, stock, idCategoria) VALUES ( 10, 'Intermitente', 'luces intermitentes ', null, 40000, 10, 3)";
  registroRol: string = "INSERT or IGNORE INTO rol(idRol, nombre) VALUES (1, 'admin'), (2, 'usuario')";
  registroEstados: string = "INSERT or IGNORE INTO estados(idEstado, nombre) VALUES (1, 'Pendiente'), (2, 'En Proceso'), (3, 'Completado')";

  admin: string ="INSERT or IGNORE INTO usuario(idusuario,nombre,correo, contrasena, id_Rol, imagen, preguntaSeleccionada, respuestaSeguridad,token ) VALUES(1,'MotorSphere', 'admin@gmail.com', 'Admin123.', 1,null, '¿Cuál fue tu primer auto?', 'MotorSphere',1)"
  cliente: string ="INSERT or IGNORE INTO usuario(idusuario,nombre,correo, contrasena, id_Rol, imagen, preguntaSeleccionada, respuestaSeguridad,token ) VALUES(2,'Catalina', 'cliente@gmail.com', 'Cliente123.', 2,null, '¿Cuál fue tu primer auto?', 'MotorSphere',1)"

  
  // Listado de Observables
  listadoUsuario = new BehaviorSubject<Usuario[]>([]);
  listadoVenta = new BehaviorSubject<Venta[]>([]);
  listadoRol = new BehaviorSubject<Rol[]>([]);
  listadoCategoria = new BehaviorSubject<Categoria[]>([]);
  listadoDetalles = new BehaviorSubject<Detalles[]>([]);
  listadoEstados = new BehaviorSubject<Estados[]>([]);
  listadoCrud = new BehaviorSubject<Crud[]>([]);
  
  public isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite, 
    private platform: Platform, 
    private alertController: AlertController,
    private storage: NativeStorage,
    private router: Router
  ) {
    this.createBD();
  }
  
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Observables getters
  fetchCrud(): Observable<Crud[]> {
    return this.listadoCrud.asObservable();
  }

  fetchUsuario(): Observable<Usuario[]> {
    return this.listadoUsuario.asObservable();
  }

  fetchVenta(): Observable<Venta[]> {
    return this.listadoVenta.asObservable();
  }

  fetchRol(): Observable<Rol[]> {
    return this.listadoRol.asObservable();
  }

  fetchCategoria(): Observable<Categoria[]> {
    return this.listadoCategoria.asObservable();
  }

  fetchDetalles(): Observable<Detalles[]> {
    return this.listadoDetalles.asObservable();
  }

  fetchEstados(): Observable<Estados[]> {
    return this.listadoEstados.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  // Creación de la base de datos
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

  // Crear tablas
  async crearTablas() {
    try {
      // Crear tablas base
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaCategoria, []);
      await this.database.executeSql(this.tablaEstados, []);
      
      // Crear tablas con dependencias
      await this.database.executeSql(this.tablaCrud, []);
      await this.database.executeSql(this.tablaUsuario, []);
      await this.database.executeSql(this.tablaVenta, []);
      await this.database.executeSql(this.tablaDetalles, []);

      // Insertar datos predeterminados
      await this.database.executeSql(this.registroRol, []);
      await this.database.executeSql(this.registroEstados, []);
      await this.database.executeSql(this.registroCrud, []);
      await this.database.executeSql(this.registroCrud2, []);
      await this.database.executeSql(this.registroCrud3, []);

      // Insertar usuarios por defecto
      const adminExiste = await this.verificarAdminExiste();
        if (!adminExiste) {
          await this.database.executeSql(this.admin, []); 
        }
      
      await this.database.executeSql(this.cliente, []);

    // Insertar categorias por defecto
      await this.database.executeSql(this.llantas, []);
      await this.database.executeSql(this.aeromatizantes, []);
      await this.database.executeSql(this.repuestos, []);
      

      // Cargar datos iniciales
      await this.cargarDatosIniciales();
      
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  async verificarAdminExiste(): Promise<boolean> {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ?',
        ['admin@gmail.com']
      );
      return res.rows.length > 0;
    } catch (e) {
      console.error('Error al verificar admin:', e);
      return false;
    }
  }

  // Cargar todos los datos iniciales
  async cargarDatosIniciales() {
    await this.seleccionarCrud();
    await this.seleccionarUsuario();
    await this.seleccionarRol();
    await this.seleccionarCategoria();
    await this.seleccionarDetalles();
    await this.seleccionarEstados();
    await this.seleccionarVenta();
  }

  // CRUD Operations

  // Crud
  async seleccionarCrud() {
    const res = await this.database.executeSql('SELECT * FROM crud', []);
    let items: Crud[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idCrud: res.rows.item(i).idcrud,
          nombre: res.rows.item(i).nombre,
          descripcion: res.rows.item(i).descripcion,
          imagen: res.rows.item(i).imagen,
          precio: res.rows.item(i).precio,
          idCategoria: res.rows.item(i).idCategoria,
          stock: res.rows.item(i).stock
        });
      }
    }
    this.listadoCrud.next(items);
  }

  async insertarCrud(nombre: string, descripcion: string, imagen: any, precio: number, idCategoria: number, stock: number) {
    try {
      await this.database.executeSql(
        'INSERT INTO crud(nombre, descripcion, imagen, precio, idCategoria, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, imagen, precio, idCategoria, stock]
      );
      await this.seleccionarCrud();
      ///this.presentAlert("Insertar", "Producto Registrado");
    } catch (e) {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    }
  }

  async modificarCrud(id: string, nombre: string, descripcion: string, imagen: any, precio: string, idCategoria: string, stock: number) {
    try {
      //this.presentAlert("1",idCategoria);
      //this.presentAlert("2",id);
      //this.presentAlert("3",nombre);
      //this.presentAlert("4",descripcion);
      //this.presentAlert("5",imagen);
      //this.presentAlert("6",precio);


      await this.database.executeSql(
        'UPDATE crud SET nombre = ?, descripcion = ?, imagen = ?, precio = ?, idCategoria = ?, stock = ? WHERE idcrud = ?',
        [nombre, descripcion, imagen, precio, idCategoria, stock, id]
      ).then(a=>{
        this.seleccionarCrud();
        //this.presentAlert("Modificar", "Producto Modificado");
        this.router.navigate(['/eliminar']);
      }).catch(e=>{
        this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
      })
      
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }

  async actualizarStock(id: number, stock: number) {
    try {
      // Actualizar el stock en la base de datos
      await this.database.executeSql(
        'UPDATE crud SET stock = stock - ? WHERE idcrud = ?',
        [stock, id]
      );
      
      // Recargar los productos después de actualizar el stock
      this.seleccionarCrud();
  
    } catch (e) {
      //this.presentAlert('Actualizar Stock', 'Error: ' + JSON.stringify(e));
    }
  }

  async eliminarCrud(id: string) {
    try {
      await this.database.executeSql('DELETE FROM crud WHERE idcrud = ?', [id]);
      await this.seleccionarCrud();
      this.presentAlert("Eliminar", "Producto Eliminado");
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
  }

  // Usuario
  async seleccionarUsuario() {
    const res = await this.database.executeSql('SELECT * FROM usuario', []);
    let items: Usuario[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idusuario: res.rows.item(i).idusuario,
          nombre: res.rows.item(i).nombre,
          correo: res.rows.item(i).correo,
          imagen: res.rows.item(i).imagen,
          contrasena: res.rows.item(i).contrasena,
          idRol: res.rows.item(i).id_Rol,
          preguntaSeleccionada: res.rows.item(i).preguntaSeleccionada,
          respuestaSeguridad: res.rows.item(i).respuestaSeguridad,
          token: res.rows.item(i).token
        });
      }
    }
    this.listadoUsuario.next(items as any);
  }

  async insertarUsuario(nombre: string, correo: string, contrasena: string, idRol: number, imagen: any, preguntaSeleccionada: string, respuestaSeguridad: string, token: number) {
    try {
      // First, check if the email already exists
      const existingUser = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ?',
        [correo]
      );
  
      if (existingUser.rows.length > 0) {
        // Email already exists, show an alert and return
        this.presentAlert('Registro', 'El correo electrónico ya está registrado');
        return false;
      }
  
      // If email doesn't exist, proceed with user insertion
      await this.database.executeSql(
        'INSERT INTO usuario(nombre, correo, contrasena, id_Rol, imagen, preguntaSeleccionada, respuestaSeguridad, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, correo, contrasena, idRol, imagen, preguntaSeleccionada, respuestaSeguridad, token]
      );
      await this.seleccionarUsuario();
      ///this.presentAlert('Registro', 'Usuario Registrado');
      return true;
    } catch (e) {
      this.presentAlert('Registro', 'Error: ' + JSON.stringify(e));
      return false;
    }
  }

  async modificarUsuario(id: string, nombre: string, correo: string, imagen: any) {
    try {
      await this.database.executeSql(
        'UPDATE usuario SET nombre = ?, correo = ?, imagen = ? WHERE idusuario = ?',
        [nombre, correo, imagen, id]
      );
      await this.seleccionarUsuario();
      this.presentAlert("Exito", "perfil editado con exito");
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }
  /////////////////////////

  async verificarContrasena(id: string, contrasena: string) {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM usuario WHERE idusuario = ? AND contrasena = ?',
        [id, contrasena]
      );
      return res.rows.length > 0 ? res.rows.item(0) : null;
    } catch (e) {
      console.error('Error al verificar contraseña:', e);
      return null;
    }
  }
  
  // Método para cerrar sesión
  async cerrarSesion() {
    try {
      // Eliminar datos de sesión almacenados localmente
       this.storage.remove('Id');
      // O
      localStorage.removeItem('Id');
      
      // También podrías querer limpiar variables de estado en el servicio
      this.listadoUsuario.next(null as any);
      this.presentAlert('Cerrando Sesión', 'Has cerrado la sesión.');
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
      throw e;
    }
  }
  
  // Actualiza el método modificarContrasena para que sea más robusto
  async modificarContrasena(id: string, contrasena: string) {
    try {
      await this.database.executeSql(
        'UPDATE usuario SET contrasena = ? WHERE idusuario = ?',
        [contrasena, id]
      );
      // Forzar actualización de los datos en memoria
      await this.seleccionarUsuario();
      return true;
    } catch (e) {
      console.error('Error al modificar contraseña:', e);
      throw e;
    }
  }
  ////////////
    // Método modificado para actualizar contraseña
    async modificarContrasena2(correo: string, nuevaContrasena: string) {
      try {
        await this.database.executeSql(
          'UPDATE usuario SET contrasena = ? WHERE correo = ?',
          [nuevaContrasena, correo]
        );
        await this.seleccionarUsuario();
        return true;
      } catch (e) {
        console.error('Error al modificar contraseña:', e);
        throw e;
      }
    }
  

    async buscarUsuarioPorCorreo(correo: string) {
      try {
        const res = await this.database.executeSql(
          'SELECT * FROM usuario WHERE correo = ?',
          [correo]
        );
        console.log('Resultado de búsqueda:', res.rows.item(0));
        if (res.rows.length > 0) {
          console.log('Pregunta de seguridad encontrada:', res.rows.item(0).preguntaSeleccionada);
        }
        return res.rows.length > 0 ? res.rows.item(0) : null;
      } catch (e) {
        console.error('Error al buscar usuario:', e);
        return null;
      }
    }

  // Nuevo método para verificar pregunta de seguridad
  async verificarPreguntaSeguridad(correo: string, respuesta: string) {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ? AND respuestaSeguridad = ?',
        [correo, respuesta]
      );
      return res.rows.length > 0 ? res.rows.item(0) : null;
    } catch (e) {
      console.error('Error al verificar pregunta de seguridad:', e);
      return null;
    }
  }
  async diagnosticarUsuario(correo: string) {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ?',
        [correo]
      );
      if (res.rows.length > 0) {
        const usuario = res.rows.item(0);
        console.log('Datos del usuario:', {
          correo: usuario.correo,
          preguntaSeleccionada: usuario.preguntaSeleccionada,
          respuestaSeguridad: usuario.respuestaSeguridad
        });
      } else {
        console.log('Usuario no encontrado');
      }
    } catch (e) {
      console.error('Error en diagnóstico:', e);
    }
  }

  
  /////////////////////////
  async searchUserById(idusuario: number) {
    return this.database.executeSql('SELECT * FROM usuario WHERE idusuario = ?', [idusuario])
      .then((res: any) => { // Declara explícitamente el tipo de res como any o el tipo correcto si lo conoces
        if (res.rows.length > 0) {
          return res.rows.item(0);
        } else {
          return null;
        }
      })
      .catch((e: any) => { // Declara explícitamente el tipo de e como any
        console.error("Error executing SQL", e);
        return null;
      });
  }
  

  // Autenticación
  async validarCredenciales(correo: string, contrasena: string): Promise<boolean> {
    try {
      const res = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ? AND contrasena = ? AND token = 1',
        [correo, contrasena]
      );
  
      if (res.rows.length > 0) {
        return true;
      } else {
        // Check if the user exists with different conditions
        const checkUserExists = await this.database.executeSql(
          'SELECT * FROM usuario WHERE correo = ?',
          [correo]
        );
  
        if (checkUserExists.rows.length > 0) {
          const userToken = checkUserExists.rows.item(0).token;
          
          if (userToken !== 1) {
            this.presentAlert('error','usuario inabilitado temporalmente');
          }else{
            this.presentAlert('error',' Email o contraseña incorrectos.');

          }
          
         
        } else {
         this.presentAlert('error','usuario no existe ');
        }
      }
    } catch (e) {
      console.error('Error al validar credenciales:', e);

      throw e; // Re-throw the specific error for proper error handling
    }
    return false;
  }

  async verificarCorreoExistente(correo: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) AS cantidad FROM usuario WHERE correo = ?';
    const resultado = await this.database.executeSql(query, [correo]);
    return resultado.rows.item(0).cantidad > 0;
  }
  
  async guardarTipoStorage(correo: string, contrasena: string) {
    try {
      const res = await this.database.executeSql(
        'SELECT idusuario, id_Rol, nombre FROM usuario WHERE correo = ? AND contrasena = ?',
        [correo, contrasena]
      );
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idusuario: res.rows.item(i).idusuario,
            id_Rol: res.rows.item(i).id_Rol,
            nombre: res.rows.item(i).nombre,
          });
        }
      }
      this.listadoUsuario.next(items);
      return items;
    } catch (e) {
      console.error('Error en guardarTipoStorage:', e);
      return [];
    }
  }

  async actualizarTokensUsuarios(): Promise<void> {
    try {
      // Iniciar una transacción
      await this.database.executeSql('BEGIN TRANSACTION');
  
      // Actualizar tokens para todos los usuarios excepto el usuario con ID 1
      const updateQuery = `
        UPDATE usuario 
        SET token = CASE 
          WHEN token = 1 THEN 0 
          WHEN token = 0 THEN 1 
          ELSE token 
        END 
        WHERE idusuario != 1
      `;
      
      await this.database.executeSql(updateQuery);
  
      // Confirmar la transacción
      await this.database.executeSql('COMMIT');
  
      console.log('Tokens actualizados correctamente');
    } catch (error) {
      // Si hay un error, revertir la transacción
      await this.database.executeSql('ROLLBACK');
      console.error('Error al actualizar tokens:', error);
      throw error;
    }
  }

  async obtenerUsuariosTokenActivo(): Promise<any[]> {
    try {
      const res = await this.database.executeSql(
        'SELECT idusuario, nombre, correo, id_Rol FROM usuario WHERE token = 1 AND idusuario != 1',
        []
      );
      
      let usuarios: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          usuarios.push(res.rows.item(i));
        }
      }
      
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios con token activo:', error);
      throw error;
    }
  }
// Método para bloquear usuario (actualizar token a 0)
async bloquearUsuario(idUsuario: number): Promise<void> {
  try {
    await this.database.executeSql(
      'UPDATE usuario SET token = 2 WHERE idusuario = ?',
      [idUsuario]
    );
  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    throw error;
  }
}


// Método para obtener usuarios bloqueados (con token 0)
async obtenerUsuariosBloqueados(): Promise<any[]> {
  try {
    const res = await this.database.executeSql(
      'SELECT idusuario, nombre, correo, id_Rol FROM usuario WHERE token = 2 AND idusuario != 1',
      []
    );
    
    let usuarios: any[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
    }
    
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios bloqueados:', error);
    throw error;
  }
}

// Método para desbloquear usuario (establecer token a 1)
async desbloquearUsuario(idUsuario: number): Promise<void> {
  try {
    await this.database.executeSql(
      'UPDATE usuario SET token = 1 WHERE idusuario = ?',
      [idUsuario]
    );
  } catch (error) {
    console.error('Error al desbloquear usuario:', error);
    throw error;
  }
}


  ////////////////////////////////////////////////////////////////////////////

  // Métodos adicionales para las demás tablas
  async seleccionarRol() {
    const res = await this.database.executeSql('SELECT * FROM rol', []);
    let items: Rol[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idRol: res.rows.item(i).idRol,
          nombre: res.rows.item(i).nombre
        });
      }
    }
    this.listadoRol.next(items);
  }

  async seleccionarCategoria() {
    const res = await this.database.executeSql('SELECT * FROM categoria', []);
    let items: Categoria[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idCategoria: res.rows.item(i).idCategoria,
          nomCateg: res.rows.item(i).nomCateg
        });
      }
    }
    this.listadoCategoria.next(items);
  }

  async seleccionarDetalles() {
    const res = await this.database.executeSql('SELECT * FROM detalles', []);
    let items: Detalles[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idDetalle: res.rows.item(i).idDetalle,
          idVenta: res.rows.item(i).idVenta,
          idProducto: res.rows.item(i).idProducto,
          cantidad: res.rows.item(i).cantidad,
          subtotal: res.rows.item(i).subtotal
        });
      }
    }
    this.listadoDetalles.next(items);
  }

  async seleccionarEstados() {
    const res = await this.database.executeSql('SELECT * FROM estados', []);
    let items: Estados[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idEstado: res.rows.item(i).idEstado,
          nombre: res.rows.item(i).nombre
        });
      }
    }
    this.listadoEstados.next(items);
  }

  async seleccionarVenta() {
    const res = await this.database.executeSql('SELECT * FROM venta', []);
    let items: Venta[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          idVenta: res.rows.item(i).idVenta,
          total: res.rows.item(i).total,
          idusuario: res.rows.item(i).idusuario,
          subtotal: res.rows.item(i).subtotal,
          idCrud: res.rows.item(i).idCrud
        });
      }
    }
    this.listadoVenta.next(items);
  }

  // Métodos para insertar en las demás tablas
  async insertarCategoria(nomCateg: string) {
    try {
      await this.database.executeSql(
        'INSERT INTO categoria(nomCateg) VALUES (?)',
        [nomCateg]
      );
      await this.seleccionarCategoria();
      this.presentAlert("Insertar", "Categoría Registrada");
    } catch (e) {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    }
  }

  async insertarVenta(total: number, idusuario: number, subtotal: number, idCrud: number) {
    try {
      await this.database.executeSql(
        'INSERT INTO venta(total, idusuario, subtotal, idCrud) VALUES (?, ?, ?, ?)',
        [total, idusuario, subtotal, idCrud]
      );
      await this.seleccionarVenta();
     // this.presentAlert("Insertar", "Venta Registrada");
    } catch (e) {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    }
  }

  async insertarDetalle(idVenta: number, idProducto: number, cantidad: number, subtotal: number) {
    try {
      await this.database.executeSql(
        'INSERT INTO detalles(idVenta, idProducto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [idVenta, idProducto, cantidad, subtotal]
      );
      await this.seleccionarDetalles();
     // this.presentAlert("Insertar", "Detalle Registrado");
    } catch (e) {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    }
  }

  // Métodos para modificar registros en las demás tablas
  async modificarCategoria(id: number, nomCateg: string) {
    try {
      await this.database.executeSql(
        'UPDATE categoria SET nomCateg = ? WHERE idCategoria = ?',
        [nomCateg, id]
      );
      await this.seleccionarCategoria();
      this.presentAlert("Modificar", "Categoría Modificada");
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }

  async modificarVenta(id: number, total: number, subtotal: number) {
    try {
      await this.database.executeSql(
        'UPDATE venta SET total = ?, subtotal = ? WHERE idVenta = ?',
        [total, subtotal, id]
      );
      await this.seleccionarVenta();
      this.presentAlert("Modificar", "Venta Modificada");
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }

  async modificarDetalle(id: number, cantidad: number, subtotal: number) {
    try {
      await this.database.executeSql(
        'UPDATE detalles SET cantidad = ?, subtotal = ? WHERE idDetalle = ?',
        [cantidad, subtotal, id]
      );
      await this.seleccionarDetalles();
      this.presentAlert("Modificar", "Detalle Modificado");
    } catch (e) {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    }
  }

  // Métodos para eliminar registros
  async eliminarCategoria(id: number) {
    try {
      await this.database.executeSql('DELETE FROM categoria WHERE idCategoria = ?', [id]);
      await this.seleccionarCategoria();
      this.presentAlert("Eliminar", "Categoría Eliminada");
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
  }

  async eliminarVenta(id: number) {
    try {
      await this.database.executeSql('DELETE FROM venta WHERE idVenta = ?', [id]);
      await this.seleccionarVenta();
      this.presentAlert("Eliminar", "Venta Eliminada");
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
  }

  async eliminarDetalle(id: number) {
    try {
      await this.database.executeSql('DELETE FROM detalles WHERE idDetalle = ?', [id]);
      await this.seleccionarDetalles();
      this.presentAlert("Eliminar", "Detalle Eliminado");
    } catch (e) {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    }
  }

  getVentas(): Promise<any[]> {
    return this.database.executeSql(
      `SELECT v.idVenta, v.total, v.subtotal, u.nombre, u.correo, u.imagen
       FROM venta v
       INNER JOIN usuario u ON v.idusuario = u.idusuario`,
      []
    ).then((res) => {
      let ventas = [];
      for (let i = 0; i < res.rows.length; i++) {
        ventas.push(res.rows.item(i));
      }
      return ventas;
    });
  }
  
  getDetallesVenta(idVenta: number): Promise<any[]> {
    const query = `
      SELECT 
        d.idDetalle, 
        d.idVenta, 
        d.idProducto, 
        d.cantidad, 
        d.subtotal, 
        c.nombre, 
        c.imagen
      FROM 
        detalles d
      INNER JOIN 
        crud c 
      ON 
        d.idProducto = c.idcrud
      WHERE 
        d.idVenta = ?;
    `;
    
    return this.database.executeSql(query, [idVenta])
      .then((res) => {
        let detalles = [];
        for (let i = 0; i < res.rows.length; i++) {
          detalles.push(res.rows.item(i));
        }
        return detalles;
      });
  }
  
  
  async getComprasUsuario(): Promise<Venta[]> {
    try {
      // Obtener el ID del usuario del NativeStorage
      const usuarioId = await this.storage.getItem('Id');
      
      // Verificar que el ID existe
      if (!usuarioId) {
        throw new Error('El usuario no está autenticado.');
      }
  
      // Ejecutar la consulta para obtener las compras del usuario
      const res = await this.database.executeSql(
        'SELECT * FROM venta WHERE idusuario = ?',
        [usuarioId]
      );
  
      // Procesar resultados
      let compras: Venta[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        compras.push(res.rows.item(i));
      }
  
      return compras;
    } catch (error) {
      console.error('Error al obtener compras del usuario:', error);
      throw error;
    }
  }
  
  fetchProductosPorCategoria(categoriaId: number) {
    return this.database.executeSql(
      `SELECT * FROM productos WHERE id_categoria = ?`, 
      [categoriaId]
    ).then((res: any) => {
      const items: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        items.push(res.rows.item(i));
      }
      return items;
    });
  }
  


} 