import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaocaoComponent } from './baocao.component';
import { BaocaoRoutingModule } from './baocao-routing.module';
import { NgchartsComponent } from './ngcharts/ngcharts.component';
import { SimpleMapComponent } from './ngcharts/simple-map/simple-map.component';

@NgModule({
  declarations: [
    BaocaoComponent,
    NgchartsComponent,
    SimpleMapComponent
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
  ]
})
export class BaocaoModule { }
