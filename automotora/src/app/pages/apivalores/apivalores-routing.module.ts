import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApivaloresPage } from './apivalores.page';

const routes: Routes = [
  {
    path: '',
    component: ApivaloresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApivaloresPageRoutingModule {}
