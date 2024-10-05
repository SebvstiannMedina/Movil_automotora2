import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoCompraPage } from './carrito-compra.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoCompraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoCompraPageRoutingModule {}
