import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QueFrecuentePage } from './que-frecuente.page';

const routes: Routes = [
  {
    path: '',
    component: QueFrecuentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueFrecuentePageRoutingModule {}
