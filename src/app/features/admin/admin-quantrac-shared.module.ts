import { TranslateModule } from '@ngx-translate/core';
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    RouterModule,
    DropDownButtonModule,
    TranslateModule
  ],
  declarations: [

  ],
  entryComponents: [
  ],
  exports: [
    FormsModule,
  ],
})
export class AdminQuantracSharedModule { }
