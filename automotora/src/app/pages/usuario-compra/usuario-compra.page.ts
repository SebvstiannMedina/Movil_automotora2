import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Venta } from 'src/app/service/venta';
import { UsuariodetallePage } from '../usuariodetalle/usuariodetalle.page';

@Component({
  selector: 'app-usuario-compra',
  templateUrl: './usuario-compra.page.html',
  styleUrls: ['./usuario-compra.page.scss'],
})
export class UsuarioCompraPage {
  compras: Venta[] = [];
  cargando: boolean = true;

  constructor(private serviceBD: ServiceBDService, private modalController: ModalController) {}

  // Este método se ejecuta cada vez que la página se carga o se navega a ella
  ionViewWillEnter() {
    this.cargarCompras();
  }

  // Método para cargar las compras del usuario
  async cargarCompras() {
    this.cargando = true; // Mostrar indicador de carga
    try {
      this.compras = await this.serviceBD.getComprasUsuario();
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      this.cargando = false; // Ocultar indicador de carga
    }
  }
    // Mostrar detalles de la venta seleccionada
    async verDetalles(idVenta: number) {
      const detalles = await this.serviceBD.getDetallesVenta(idVenta);
  
      const modal = await this.modalController.create({
        component: UsuariodetallePage,
        componentProps: { detalles: detalles }
      });
  
      await modal.present();
    }
}