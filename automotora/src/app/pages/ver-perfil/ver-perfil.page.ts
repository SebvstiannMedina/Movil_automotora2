import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.page.html',
  styleUrls: ['./ver-perfil.page.scss'],
})
export class VerPerfilPage implements OnInit {
  username: string = "";
  email: string = "";
  password: string = "";
  id_user!: number;

  constructor(
    private router: Router,
    private bd: ServiceBDService,
    private storage: NativeStorage,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.getItem('Id').then((data: any) => {
      this.id_user = data;

      // Llamar la consulta solo cuando se haya obtenido el ID
      return this.bd.searchUserById(this.id_user).then((data: any) => {
        if (data) {
          this.username = data.nombre;
          this.email = data.correo;
          this.password = data.contrasena;

          // Detectar cambios para actualizar la vista
          this.cdr.detectChanges();
        }
      });
    }).catch((error: any) => {
      console.error("Error retrieving user data", error);
    });
  }
}