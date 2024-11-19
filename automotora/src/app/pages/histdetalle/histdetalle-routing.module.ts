import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistdetallePage } from './histdetalle.page';

const routes: Routes = [
  {
    path: '',
    component: HistdetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistdetallePageRoutingModule {}
