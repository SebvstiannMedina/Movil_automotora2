import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LlantaPage } from './llanta.page';

const routes: Routes = [
  {
    path: '',
    component: LlantaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LlantaPageRoutingModule {}
