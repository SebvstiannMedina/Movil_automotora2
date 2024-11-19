import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistdetallePageRoutingModule } from './histdetalle-routing.module';

import { HistdetallePage } from './histdetalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistdetallePageRoutingModule
  ],
  declarations: [HistdetallePage]
})
export class HistdetallePageModule {}
