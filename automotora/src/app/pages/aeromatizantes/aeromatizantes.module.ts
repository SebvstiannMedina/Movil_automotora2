import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AeromatizantesPageRoutingModule } from './aeromatizantes-routing.module';

import { AeromatizantesPage } from './aeromatizantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AeromatizantesPageRoutingModule
  ],
  declarations: [AeromatizantesPage]
})
export class AeromatizantesPageModule {}
