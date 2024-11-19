import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistUsuarioPageRoutingModule } from './hist-usuario-routing.module';

import { HistUsuarioPage } from './hist-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistUsuarioPageRoutingModule
  ],
  declarations: [HistUsuarioPage]
})
export class HistUsuarioPageModule {}
