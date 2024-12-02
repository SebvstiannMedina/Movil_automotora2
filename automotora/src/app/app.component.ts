import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';  
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from './service/service-bd.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  verMenu = true;
  nombreUsuario: string = '';
  
  username: string = "";
  email: string = "";
  password: string = "";
  id_user!: number;
  imagen!: any;


  constructor(
    private router: Router,
    private storage: NativeStorage,
    private alertController: AlertController,
    private bd: ServiceBDService,
    private cdr: ChangeDetectorRef
  ) {
    // Mejora en el manejo de eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      this.checkMenuVisibility(event.url);
      this.updateUserData(); // Actualiza los datos cuando cambia la página
    });
  }

  ngOnInit() {
    // Suscripción al estado de la base de datos
    this.bd.dbState().pipe(
      takeUntil(this.destroy$)
    ).subscribe(async (isReady) => {
      if (isReady) {
        await this.updateUserData();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para actualizar datos del usuario
  private async updateUserData() {
    try {
      const nombre = await this.storage.getItem('Nombre');
      this.nombreUsuario = nombre || 'Invitado';
      
      // Aquí puedes agregar más actualizaciones de datos si es necesario
      this.bd.fetchUsuario().pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (userData) => {
          // Actualiza los datos del usuario según sea necesario
          if (userData) {
            // Actualiza los datos necesarios
            this.nombreUsuario =  this.nombreUsuario;
            this.ionViewWillEnter();
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  checkMenuVisibility(url: string) {
    const noveras = [
      '/login', '/registro', '/ver-perfil', '/editar-perfil',
      '/recupera-contra', '/cambio-contra', '/not-found'
    ];
    this.verMenu = !noveras.includes(url);
  }



  cerrarSesion() {
    this.bd.cerrarSesion();
    this.router.navigate(['/login']);
    //await this.storage.remove('Id');
    this.cdr.detectChanges();
  }


  ionViewWillEnter() {
    this.storage.getItem('Id').then((data: any) => {
      this.id_user = data;

      // Llamar a la consulta solo cuando se haya obtenido el ID
      this.bd.searchUserById(this.id_user).then((data: any) => {
        if (data) {
          this.username = data.nombre;
          this.email = data.correo;
          this.password = data.contrasena;
          this.imagen = data.imagen;
          //this.preguntaSeleccionada = data.preguntaSeleccionada;
          //this.respuestaSeguridad = data.respuestaSeguridad;
          //this.token = data.token;

         // if (data.imagen) {
          //  this.imagen = `data:image/jpeg;base64,${data.imagen}`;
         // }
          // Detectar cambios para actualizar la vista
          this.cdr.detectChanges();
        }
      });
    }).catch((error: any) => {
      console.error("Error retrieving user data", error);
    });
  }

}