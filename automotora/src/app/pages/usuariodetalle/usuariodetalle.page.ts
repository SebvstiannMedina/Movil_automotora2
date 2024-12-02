import { Component,Input  } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-usuariodetalle',
  templateUrl: './usuariodetalle.page.html',
  styleUrls: ['./usuariodetalle.page.scss'],
})
export class UsuariodetallePage  {
  @Input() detalles: any[] = [];

  constructor(private modalController: ModalController) {}

  // Cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }

}
