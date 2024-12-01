import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuarioCompraPageRoutingModule } from './usuario-compra-routing.module';

import { UsuarioCompraPage } from './usuario-compra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioCompraPageRoutingModule
  ],
  declarations: [UsuarioCompraPage]
})
export class UsuarioCompraPageModule {}
