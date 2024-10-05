import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPerfilPage } from './ver-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: VerPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPerfilPageRoutingModule {}
