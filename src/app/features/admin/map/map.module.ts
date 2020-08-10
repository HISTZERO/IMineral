import { TranslateModule } from "@ngx-translate/core";
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

import { MapRoutingModule } from "./map-routing.module";
import { MaterialModule } from "src/app/shared/material.module";
import { LayerListComponent } from "./layer/layer-list/layer-list.component";
import { LayerIoComponent } from "./layer/layer-io/layer-io.component";
import { LayerGroupIoComponent } from "./layer-group/layer-group-io/layer-group-io.component";
import { LayerGroupListComponent } from "./layer-group/layer-group-list/layer-group-list.component";
import { CommonPipesModule } from "src/app/shared/pipes/common-pipes.module";
import { LayerGroupDetailListComponent } from "./layer-group/layer-group-detail-list/layer-group-detail-list.component";
import { LayerGroupDetailIoComponent } from "./layer-group/layer-group-detail-io/layer-group-detail-io.component";
import { LayerGroupAddLayerIoComponent } from "./layer-group/layer-group-add-layer-io/layer-group-add-layer-io.component";
import { MapListComponent } from "./map/map-list/map-list.component";
import { MapIoComponent } from "./map/map-io/map-io.component";
import { MapGroupListComponent } from "./map-group/map-group-list/map-group-list.component";
import { MapGroupIoComponent } from "./map-group/map-group-io/map-group-io.component";
import { ProjectionListComponent } from "./projection/projection-list/projection-list.component";
import { ProjectionIoComponent } from "./projection/projection-io/projection-io.component";
import { MapDetailListComponent } from "./map/map-detail-list/map-detail-list.component";
import { MapDetailAddLayerIoComponent } from "./map/map-detail-add-layer-io/map-detail-add-layer-io.component";
import { CategoryListComponent } from "./category/category-list/category-list.component";
import { CategoryIoComponent } from "./category/category-io/category-io.component";
// Import AdminShare để sử dụng các components dùng chung cho toàn bộ admin
// Import AdminQuantracShared để sử dụng các components riêng cho phần quan trắc
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { FeaturesSharedModule } from "src/app/features/features-shared.module";
import { MapDetailAddNewGroupIoComponent } from "./map/map-detail-add-new-group-io/map-detail-add-new-group-io.component";
import { MapDetailAddLayerGroupIoComponent } from "./map/map-detail-add-layer-group-io/map-detail-add-layer-group-io.component";
import { MapDetailEditLayerPropertiesComponent } from "./map/map-detail-edit-layer-properties/map-detail-edit-layer-properties.component";
import { MapDetailEditLayergroupPropertiesComponent } from "./map/map-detail-edit-layergroup-properties/map-detail-edit-layergroup-properties.component";

@NgModule({
  declarations: [
    LayerListComponent,
    LayerIoComponent,
    LayerGroupIoComponent,
    LayerGroupListComponent,
    LayerGroupDetailListComponent,
    LayerGroupDetailIoComponent,
    LayerGroupAddLayerIoComponent,
    MapListComponent,
    MapIoComponent,
    MapGroupListComponent,
    MapGroupIoComponent,
    ProjectionListComponent,
    ProjectionIoComponent,
    MapDetailListComponent,
    MapDetailAddLayerIoComponent,
    CategoryListComponent,
    CategoryIoComponent,
    MapDetailAddLayerGroupIoComponent,
    MapDetailEditLayerPropertiesComponent,
    MapDetailEditLayergroupPropertiesComponent,
    MapDetailAddNewGroupIoComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
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
  entryComponents: [
    LayerIoComponent,
    LayerGroupIoComponent,
    LayerGroupDetailIoComponent,
    LayerGroupAddLayerIoComponent,
    MapIoComponent,
    MapGroupIoComponent,
    ProjectionIoComponent,
    MapDetailEditLayerPropertiesComponent,
    MapDetailAddLayerIoComponent,
    CategoryIoComponent,
    MapDetailAddLayerGroupIoComponent,
    MapDetailEditLayergroupPropertiesComponent,
    MapDetailAddNewGroupIoComponent,
  ],
})
export class MapModule {}
