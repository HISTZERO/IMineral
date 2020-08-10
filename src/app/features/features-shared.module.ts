import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import AdminShare để sử dụng các components dùng chung cho toàn bộ admin
// Import AdminQuantracShared để sử dụng các components riêng cho phần quan trắc
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class FeaturesSharedModule { }
