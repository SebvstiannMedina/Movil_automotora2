import { Component,Input  } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-histdetalle',
  templateUrl: './histdetalle.page.html',
  styleUrls: ['./histdetalle.page.scss'],
})
export class HistdetallePage  {

  @Input() detalles: any[] = [];

  constructor(private modalController: ModalController) {}

  // Cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }


}
