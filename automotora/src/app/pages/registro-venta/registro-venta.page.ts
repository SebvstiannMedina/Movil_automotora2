import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { HistdetallePage } from '../histdetalle/histdetalle.page';

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.page.html',
  styleUrls: ['./registro-venta.page.scss'],
})
export class RegistroVentaPage implements OnInit {
  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  terminoBusqueda: string = '';  // Término de búsqueda

  constructor(private serviceBD: ServiceBDService, private modalController: ModalController) {}

  ngOnInit() {
    this.cargarVentas();
  }

  // Cargar ventas desde la base de datos
  cargarVentas() {
    this.serviceBD.getVentas().then((ventas) => {
      this.ventas = ventas;
      this.ventasFiltradas = [...this.ventas];  // Inicializa las ventas filtradas
    });
  }

  // Filtrar ventas según el término de búsqueda
  filtrarVentas() {
    this.ventasFiltradas = this.ventas.filter(venta =>
      venta.idVenta.toString().includes(this.terminoBusqueda)
    );
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
