import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { HistdetallePage } from '../histdetalle/histdetalle.page';

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.page.html',
  styleUrls: ['./registro-venta.page.scss'],
})
export class RegistroVentaPage implements OnInit {
  ventas: any[] = [];

  constructor(private serviceBD: ServiceBDService, private modalController: ModalController) {}

  ngOnInit() {
    this.cargarVentas();
  }

  // Cargar ventas desde la base de datos
  cargarVentas() {
    this.serviceBD.getVentas().then((ventas) => {
      this.ventas = ventas;
    });
  }

  // Mostrar detalles de la venta seleccionada
  async verDetalles(idVenta: number) {
    const detalles = await this.serviceBD.getDetallesVenta(idVenta);

    const modal = await this.modalController.create({
      component: HistdetallePage,
      componentProps: { detalles: detalles }
    });

    await modal.present();
  }
}
