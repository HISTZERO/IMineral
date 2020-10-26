import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  FilterService,
  GridModule,
  GroupService,
  PageService,
  SearchService,
  SortService,
  ToolbarService,
  ResizeService,
} from "@syncfusion/ej2-angular-grids";
// Các module Material UI
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { SharedModule } from "src/app/shared/shared.module";
import { MatSelectFilterModule } from "mat-select-filter";
import { SubHeaderComponent } from "src/app/shared/components/sub-header/sub-header.component";

// Các services core
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  DateTimeAdapter,
  OWL_DATE_TIME_LOCALE,
  OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from "ng-pick-datetime-moment";
import { HeaderComponent } from "src/app/features/admin/layout/header/header.component";
import { PheduyetDulieuComponent } from "src/app/shared/components/pheduyet-dulieu/pheduyet-dulieu.component";
import { ToadokhuvucComponent } from "src/app/shared/components/toadokhuvuc/toadokhuvuc.component";

// Format custom
export const MY_CUSTOM_FORMATS = {
  parseInput: "DD-MM-YYYY HH:mm:ss",
  fullPickerInput: "DD-MM-YYYY HH:mm:ss",
  datePickerInput: "DD-MM-YYYY",
  timePickerInput: " HH:mm:ss",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY",
};
@NgModule({
  imports: [
    CommonModule,
    GridModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CKEditorModule,
    MatSelectFilterModule,
    SharedModule,
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTabsModule,
    TranslateModule
  ],
  exports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule,
    CKEditorModule,
    MatSelectFilterModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    SubHeaderComponent,
    OwlDateTimeModule,
    MatSlideToggleModule,
    MatTabsModule,
    HeaderComponent,
    ToadokhuvucComponent
  ],
  declarations: [
    SubHeaderComponent,
    PheduyetDulieuComponent,
    HeaderComponent,
    ToadokhuvucComponent
  ],
  entryComponents: [
    SubHeaderComponent,
    ToadokhuvucComponent
  ],
  providers: [
    MatdialogService,
    MatsidenavService,
    PageService,
    FilterService,
    SortService,
    SearchService,
    GroupService,
    ToolbarService,
    ResizeService,
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: "vi" },
    // {
    //   provide: DateTimeAdapter,
    //   useClass: MomentDateTimeAdapter,
    //   deps: [OWL_DATE_TIME_LOCALE],
    // },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    DatePipe,
  ],
})
export class AdminSharedModule { }
