import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, RefresherCustomEvent } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-hist-usuario',
  templateUrl: './hist-usuario.page.html',
  styleUrls: ['./hist-usuario.page.scss'],
})
export class HistUsuarioPage implements OnInit {
  usuariosConTokenActivo: any[] = [];
  usuariosBloqueados: any[] = [];
  usuariosFiltradosActivos: any[] = [];
  usuariosFiltradosBloqueados: any[] = [];
  seccionActual: string = 'activos';
  terminoBusqueda: string = '';  // Término de búsqueda

  // Mapeo de roles (asegúrate de tener esta información de tu base de datos)
  idRol: { [key: number]: string } = {
    1: 'Administrador',
    2: 'Usuario'
    // Agrega más roles según tu configuración
  };
  

  constructor(
    private bd: ServiceBDService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios(event?: RefresherCustomEvent) {
    const loading = await this.loadingController.create({
      message: 'Cargando usuarios...'
    });
    await loading.present();

    try {
      this.usuariosConTokenActivo = await this.bd.obtenerUsuariosTokenActivo();
      this.usuariosFiltradosActivos = [...this.usuariosConTokenActivo];  // Inicializamos la lista filtrada
      if (event) {
        event.target.complete();
      }
    } catch (error) {
      this.mostrarAlerta('Error', 'No se pudieron cargar los usuarios');
    } finally {
      await loading.dismiss();
    }
  }

  async cargarUsuariosBloqueados(event?: RefresherCustomEvent) {
    const loading = await this.loadingController.create({
      message: 'Cargando usuarios bloqueados...'
    });
    await loading.present();

    try {
      this.usuariosBloqueados = await this.bd.obtenerUsuariosBloqueados();
      this.usuariosFiltradosBloqueados = [...this.usuariosBloqueados];  // Inicializamos la lista filtrada
      if (event) {
        event.target.complete();
      }
    } catch (error) {
      this.mostrarAlerta('Error', 'No se pudieron cargar los usuarios bloqueados');
    } finally {
      await loading.dismiss();
    }
  }

  // Filtrar usuarios según el término de búsqueda
  filtrarUsuarios() {
    if (this.seccionActual === 'activos') {
      this.usuariosFiltradosActivos = this.usuariosConTokenActivo.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        usuario.idusuario.toString().includes(this.terminoBusqueda)
      );
    } else {
      this.usuariosFiltradosBloqueados = this.usuariosBloqueados.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        usuario.idusuario.toString().includes(this.terminoBusqueda)
      );
    }
  }

  async actualizarTokens() {
    const alert = await this.alertController.create({
      header: 'Actualizar Tokens',
      message: '¿Está seguro de actualizar los tokens de los usuarios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Actualizando tokens...'
            });
            await loading.present();

            try {
              await this.bd.actualizarTokensUsuarios();
              await this.cargarUsuarios();
              this.mostrarAlerta('Éxito', 'Tokens actualizados correctamente');
            } catch (error) {
              this.mostrarAlerta('Error', 'No se pudieron actualizar los tokens');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async bloquearUsuario(idUsuario: number) {
    const alert = await this.alertController.create({
      header: 'Bloquear Usuario',
      message: '¿Está seguro de bloquear este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Bloqueando usuario...'
            });
            await loading.present();

            try {
              // Implementa la lógica de bloqueo en tu servicio
              await this.bd.bloquearUsuario(idUsuario);
              await this.cargarUsuarios();
              this.mostrarAlerta('Éxito', 'Usuario bloqueado correctamente');
            } catch (error) {
              this.mostrarAlerta('Error', 'No se pudo bloquear el usuario');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  obtenerNombreRol(idRol: number): string {
    return this.idRol[idRol] || 'Rol Desconocido';
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  cambiarSeccion() {
    if (this.seccionActual === 'bloqueados') {
      this.cargarUsuariosBloqueados();
    } else {
      this.cargarUsuarios();
    }
  }

  async desbloquearUsuario(idUsuario: number) {
    const alert = await this.alertController.create({
      header: 'Desbloquear Usuario',
      message: '¿Está seguro de desbloquear este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Desbloqueando usuario...'
            });
            await loading.present();

            try {
              await this.bd.desbloquearUsuario(idUsuario);
              await this.cargarUsuariosBloqueados();
              await this.cargarUsuarios();
              this.mostrarAlerta('Éxito', 'Usuario desbloqueado correctamente');
            } catch (error) {
              this.mostrarAlerta('Error', 'No se pudo desbloquear el usuario');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
