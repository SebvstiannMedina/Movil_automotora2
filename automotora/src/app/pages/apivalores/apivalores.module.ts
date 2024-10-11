import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApivaloresPageRoutingModule } from './apivalores-routing.module';

import { ApivaloresPage } from './apivalores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApivaloresPageRoutingModule
  ],
  declarations: [ApivaloresPage]
})
export class ApivaloresPageModule {}
