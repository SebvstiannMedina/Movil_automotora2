import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LlantaPageRoutingModule } from './llanta-routing.module';

import { LlantaPage } from './llanta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LlantaPageRoutingModule
  ],
  declarations: [LlantaPage]
})
export class LlantaPageModule {}
