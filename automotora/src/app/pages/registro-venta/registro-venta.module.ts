import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroVentaPageRoutingModule } from './registro-venta-routing.module';

import { RegistroVentaPage } from './registro-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroVentaPageRoutingModule
  ],
  declarations: [RegistroVentaPage]
})
export class RegistroVentaPageModule {}
