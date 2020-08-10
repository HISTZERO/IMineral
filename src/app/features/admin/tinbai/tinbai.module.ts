import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import {
  MatSidenavModule,
  MatDialogModule,
  MatSelectModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MatSelectFilterModule } from "mat-select-filter";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TinbaiRoutingModule } from "src/app/features/admin/tinbai/tinbai-routing.module";
import { MaterialModule } from "src/app/shared/material.module";
import { TinbaiComponent } from "src/app/features/admin/tinbai/tinbai.component";
import { ChudeComponent } from "src/app/features/admin/tinbai/chude/chude.component";
import { TintucComponent } from "src/app/features/admin/tinbai/tintuc/tintuc.component";
import { ChudeIoComponent } from "src/app/features/admin/tinbai/chude/chude-io.component";
import { TintucIoComponent } from "src/app/features/admin/tinbai/tintuc/tintuc-io.component";
import { CommonPipesModule } from "src/app/shared/pipes/common-pipes.module";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { FeaturesSharedModule } from "src/app/features/features-shared.module";
import { ReviewComponent } from "./tintuc/review/review.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    TinbaiComponent,
    ChudeComponent,
    TintucComponent,
    ChudeIoComponent,
    TintucIoComponent,
    ReviewComponent,
  ],
  imports: [
    TinbaiRoutingModule,
    AdminSharedModule,
    CommonModule,
    TinbaiRoutingModule,
    GridModule,
    MatSidenavModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    CKEditorModule,
    MatProgressSpinnerModule,
    MatSelectFilterModule,
    SharedModule,
    NgbModule,
    CommonPipesModule,
    MatSlideToggleModule,
    MaterialModule,
    AdminSharedModule,
    FeaturesSharedModule,
    TranslateModule,
  ],
  entryComponents: [ChudeIoComponent],
})
export class TinbaiModule {}
