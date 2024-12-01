import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariodetallePage } from './usuariodetalle.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariodetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariodetallePageRoutingModule {}
