import {NgModule} from "@angular/core";
import {HethongComponent} from "./hethong.component";
import {HethongRoutingModule} from "./hethong-routing.module";
import { HethongLogComponent } from './hethong-log/hethong-log.component';
import {AdminSharedModule} from "../admin-shared.module";
import {CommonModule} from "@angular/common";

@NgModule ({
  declarations: [
    HethongComponent,
    HethongLogComponent
  ],
  imports: [
    HethongRoutingModule,
    AdminSharedModule,
    CommonModule
  ],
  entryComponents: []
})
export class HethongModule {}
