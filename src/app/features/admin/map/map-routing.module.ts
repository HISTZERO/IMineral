import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { MapListComponent } from "src/app/features/admin/map/map/map-list/map-list.component";
import { LayerListComponent } from "src/app/features/admin/map/layer/layer-list/layer-list.component";
import { CategoryListComponent } from "src/app/features/admin/map/category/category-list/category-list.component";
import { MapDetailListComponent } from "src/app/features/admin/map/map/map-detail-list/map-detail-list.component";
import { ProjectionListComponent } from "src/app/features/admin/map/projection/projection-list/projection-list.component";
import { LayerGroupListComponent } from "src/app/features/admin/map/layer-group/layer-group-list/layer-group-list.component";
import { LayerGroupDetailListComponent } from "src/app/features/admin/map/layer-group/layer-group-detail-list/layer-group-detail-list.component";

const mapRoutes: Routes = [
  {
    path: "",
    children: [
      { path: "", component: MapListComponent },
      { path: AdminRoutingName.nhombandoUri, component: CategoryListComponent },
      { path: AdminRoutingName.bandoUri, component: MapListComponent },
      {
        path: AdminRoutingName.bandoUri + "/:id",
        component: MapDetailListComponent,
      },
      { path: AdminRoutingName.lopbandoUri, component: LayerListComponent },
      {
        path: AdminRoutingName.nhomlopbandoUri,
        component: LayerGroupListComponent,
      },
      {
        path: AdminRoutingName.nhomlopbandoUri + "/:id",
        component: LayerGroupDetailListComponent,
      },
      { path: AdminRoutingName.hetoadoUri, component: ProjectionListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mapRoutes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
