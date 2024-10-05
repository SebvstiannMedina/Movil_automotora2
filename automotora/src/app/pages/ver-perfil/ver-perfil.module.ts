import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPerfilPageRoutingModule } from './ver-perfil-routing.module';

import { VerPerfilPage } from './ver-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPerfilPageRoutingModule
  ],
  declarations: [VerPerfilPage]
})
export class VerPerfilPageModule {}
