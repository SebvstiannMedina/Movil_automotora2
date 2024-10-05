import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroVentaPage } from './registro-venta.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroVentaPageRoutingModule {}
