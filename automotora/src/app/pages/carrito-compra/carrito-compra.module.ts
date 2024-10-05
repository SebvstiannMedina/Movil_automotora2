import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoCompraPageRoutingModule } from './carrito-compra-routing.module';

import { CarritoCompraPage } from './carrito-compra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoCompraPageRoutingModule
  ],
  declarations: [CarritoCompraPage]
})
export class CarritoCompraPageModule {}
