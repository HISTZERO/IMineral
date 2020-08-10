import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularSplitModule } from "angular-split";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { MaterialModule } from "src/app/shared/material.module";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import { CommonPipesModule } from "src/app/shared/pipes/common-pipes.module";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatSidenavModule,
  MatDialogModule,
  MatSelectModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { OwlDateTimeModule } from "ng-pick-datetime";

import { MapComponent } from "./map.component";
import { SharedModule } from "src/app/shared/shared.module";
import { HeaderComponent } from "./layout/header/header.component";
import { MapDetailComponent } from "./map-detail/map-detail.component";
import { MapRoutingModule } from "src/app/features/map/map-routing.module";

// Import AdminShare để sử dụng các components dùng chung cho toàn bộ admin
// Import AdminQuantracShared để sử dụng các components riêng cho phần quan trắc
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { FeaturesSharedModule } from "src/app/features/features-shared.module";

@NgModule({
  declarations: [MapComponent, HeaderComponent, MapDetailComponent],
  imports: [
    GridModule,
    SharedModule,
    CommonModule,
    MapRoutingModule,
    MatSidenavModule,
    MaterialModule,
    MatDialogModule,
    MatSelectModule,
    AdminSharedModule,
    CommonPipesModule,
    OwlDateTimeModule,
    DropDownButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FeaturesSharedModule,
    AngularSplitModule.forRoot(),
    TranslateModule,
  ],
  exports: [],
  entryComponents: [],
})
export class MapModule { }
