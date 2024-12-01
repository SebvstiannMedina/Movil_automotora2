import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioCompraPage } from './usuario-compra.page';

const routes: Routes = [
  {
    path: '',
    component: UsuarioCompraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioCompraPageRoutingModule {}
