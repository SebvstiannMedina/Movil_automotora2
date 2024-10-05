import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperaContraPage } from './recupera-contra.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperaContraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperaContraPageRoutingModule {}
