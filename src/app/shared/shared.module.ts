import { TranslateModule } from "@ngx-translate/core";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  TreeGridModule,
  FilterService,
} from "@syncfusion/ej2-angular-treegrid";
import { MaterialModule } from "src/app/shared/material.module";
import {
  GridModule,
  ToolbarService,
  ExcelExportService, EditService
} from "@syncfusion/ej2-angular-grids";
import { AngularSplitModule } from "angular-split";
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from "ng-pick-datetime";

import { SharedFacadeService } from "src/app/shared/shared-facade.service";
import { CommonPipesModule } from "src/app/shared/pipes/common-pipes.module";
import { HighchartService } from "../services/admin/common/highchart.service";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ValidatorToaDoService } from "src/app/services/utilities/validatorService";
import { ProgressHttpInterceptor } from "src/app/services/progress/progress.interceptor";

import { BrandComponent } from "./components/layout/brand/brand.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { MyAlertDialogComponent } from "./components/my-alert-dialog/my-alert-dialog.component";
import { LayerTreeComponent } from "src/app/shared/components/layer-tree/layer-tree.component";
import { MapListPopupComponent } from "src/app/shared/components/map/map-list-popup/map-list-popup.component";
import { LayerListPopupComponent } from "src/app/shared/components/map/layer-list-popup/layer-list-popup.component";
import { ContentContainerDirective } from './directives/content-container/content-container.directive';

// @ts-ignore
@NgModule({
  declarations: [
    MyAlertDialogComponent,
    LayerListPopupComponent,
    MapListPopupComponent,
    LayerTreeComponent,
    FooterComponent,
    BrandComponent,
    ContentContainerDirective
  ],
  imports: [
    TreeGridModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    GridModule,
    CommonPipesModule,
    MaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularSplitModule.forRoot(),
    TranslateModule,
  ],
  entryComponents: [
    MyAlertDialogComponent,
    LayerListPopupComponent,
    MapListPopupComponent,
  ],
  providers: [
    EditService,
    ValidatorToaDoService,
    FilterService,
    ExcelExportService,
    ToolbarService,
    MatsidenavService,
    MatdialogService,
    CommonServiceShared,
    TitleCasePipe,
    SharedFacadeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressHttpInterceptor,
      multi: true,
    },
    HighchartService,
  ],
  exports: [
    TreeGridModule,
    LayerTreeComponent,
    CommonPipesModule,
    FooterComponent,
    BrandComponent,
    ContentContainerDirective
  ],
})
export class SharedModule { }
