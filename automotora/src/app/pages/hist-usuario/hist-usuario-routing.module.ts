import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistUsuarioPage } from './hist-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: HistUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistUsuarioPageRoutingModule {}
