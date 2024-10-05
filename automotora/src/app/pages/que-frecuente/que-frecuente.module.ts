import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueFrecuentePageRoutingModule } from './que-frecuente-routing.module';

import { QueFrecuentePage } from './que-frecuente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueFrecuentePageRoutingModule
  ],
  declarations: [QueFrecuentePage]
})
export class QueFrecuentePageModule {}
