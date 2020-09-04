import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaocaoComponent } from 'src/app/features/admin/baocao/baocao.component';
import { BaocaoRoutingModule } from 'src/app/features/admin/baocao/baocao-routing.module';

@NgModule({
  declarations: [
    BaocaoComponent,
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
  ]
})
export class BaocaoModule { }
