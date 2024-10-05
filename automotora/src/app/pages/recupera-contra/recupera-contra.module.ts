import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperaContraPageRoutingModule } from './recupera-contra-routing.module';

import { RecuperaContraPage } from './recupera-contra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperaContraPageRoutingModule
  ],
  declarations: [RecuperaContraPage]
})
export class RecuperaContraPageModule {}
