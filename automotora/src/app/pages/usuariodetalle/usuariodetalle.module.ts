import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariodetallePageRoutingModule } from './usuariodetalle-routing.module';

import { UsuariodetallePage } from './usuariodetalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariodetallePageRoutingModule
  ],
  declarations: [UsuariodetallePage]
})
export class UsuariodetallePageModule {}
