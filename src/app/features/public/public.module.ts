import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimplebarAngularModule } from "simplebar-angular";
import { AngularSplitModule } from "angular-split";
import { HttpClientModule } from "@angular/common/http";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { MatSelectFilterModule } from "mat-select-filter";
import { MaterialModule } from "src/app/shared/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import {
  MatSidenavModule,
  MatDialogModule,
  MatSelectModule,
} from "@angular/material";
import { OwlDateTimeModule } from "ng-pick-datetime";
import { TranslateModule } from "@ngx-translate/core";

import { PublicComponent } from "src/app/features/public/public.component";
import { PublicRoutingModule } from "src/app/features/public/public-routing.module";

// Import AdminShare để sử dụng các components dùng chung cho toàn bộ admin
// Import AdminQuantracShared để sử dụng các components riêng cho phần quan trắc
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { FeaturesSharedModule } from "src/app/features/features-shared.module";

@NgModule({
  declarations: [
    PublicComponent,
  ],
  exports: [],
  imports: [
    FormsModule,
    GridModule,
    CommonModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    FeaturesSharedModule,
    MatSelectFilterModule,
    PublicRoutingModule,
    MatSidenavModule,
    AdminSharedModule,
    MaterialModule,
    DropDownButtonModule,
    OwlDateTimeModule,
    MatDialogModule,
    MatSelectModule,
    AngularSplitModule.forRoot(),
    SimplebarAngularModule,
    TranslateModule,
  ],
  entryComponents: [],
})
export class PublicModule { }
