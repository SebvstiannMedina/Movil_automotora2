import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AeromatizantesPage } from './aeromatizantes.page';

const routes: Routes = [
  {
    path: '',
    component: AeromatizantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AeromatizantesPageRoutingModule {}
