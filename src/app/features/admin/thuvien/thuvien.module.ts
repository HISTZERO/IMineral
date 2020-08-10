import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThuvienComponent } from "./thuvien.component";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AdminSharedModule } from "../admin-shared.module";
import { ThuvienRoutingModule } from "./thuvien-routing.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OwlDateTimeModule } from "ng-pick-datetime";
import { MatPaginatorModule } from "@angular/material/paginator";
import { TabUploadComponent } from './tab-upload/tab-upload.component';
import { MatTabsModule } from "@angular/material/tabs";
import { AngularSplitModule } from "angular-split";
import { MaterialModule } from "src/app/shared/material.module";

@NgModule({
  declarations: [ThuvienComponent, TabUploadComponent],
  imports: [
    CommonModule,
    ThuvienRoutingModule,
    GridModule,
    MatSidenavModule,
    AdminSharedModule,
    OwlDateTimeModule,
    MatPaginatorModule,
    MatTabsModule,
    AngularSplitModule.forRoot(),
    MaterialModule,
    TranslateModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
})
export class ThuvienModule { }
