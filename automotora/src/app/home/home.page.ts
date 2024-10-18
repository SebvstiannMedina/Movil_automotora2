import { Component, OnInit } from '@angular/core';
import { ApitimeService } from '../services/apitime.service';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular'; // Importa el AlertController

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  chileTime!: string;
  isConnected: boolean = true; // Variable para manejar el estado de la red

  constructor(
    private apitimeService: ApitimeService,
    private alertController: AlertController // Inyecta el AlertController
  ) {}

  async ngOnInit() {
    // Verificar el estado inicial de la conexión
    const status = await Network.getStatus();
    this.isConnected = status.connected;

    if (this.isConnected) {
      // Si hay conexión, procede a obtener la hora de Chile
      this.fetchChileTime();
    } else {
      console.log('No hay conexión a internet');
      this.showNoConnectionAlert(); // Muestra la alerta si no hay conexión
    }

    // Escuchar cambios en la conexión
    Network.addListener('networkStatusChange', (status) => {
      this.isConnected = status.connected;
      if (!this.isConnected) {
        console.log('Se ha perdido la conexión');
        this.showNoConnectionAlert(); // Muestra la alerta cuando se pierde la conexión
      } else {
        // Si la conexión vuelve, intenta nuevamente obtener la hora
        this.fetchChileTime();
      }
    });
  }

  fetchChileTime() {
    this.apitimeService.getChiletime().subscribe(
      (data: any) => {
        this.chileTime = data.datetime; // Obtén el campo `datetime` de la API
      },
      (error) => {
        console.error('Error fetching time:', error);
      }
    );
  }

  // Función para mostrar la alerta de no conexión
  async showNoConnectionAlert() {
    const alert = await this.alertController.create({
      header: 'Error de conexión',
      message: 'No tienes acceso a internet. Por favor, verifica tu conexión.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
