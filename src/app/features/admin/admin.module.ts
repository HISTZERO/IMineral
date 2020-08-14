import { CommonModule } from "@angular/common";
import { ComponentFactoryResolver, NgModule } from "@angular/core";

import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";

// Các module features thành phần của phần quản trị dữ liệu
import { AdminComponent } from "./admin.component";
import { ThuvienModule } from "./thuvien/thuvien.module";
import { HethongModule } from "./hethong/hethong.module";
import { SimplebarAngularModule } from "simplebar-angular";
import { ThietlapModule } from "./thietlap/thietlap.module";
import { QuantriRoutingModule } from "./admin-routing.module";
import { MapModule } from "src/app/features/admin/map/map.module";
import { ThongkeModule } from "src/app/features/admin/thongke/thongke.module";
import { BaocaoModule } from "src/app/features/admin/baocao/baocao.module";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { ErrorModule } from "src/app/shared/modules/error/error.module";

// Components
import { DashboardComponent } from "src/app/features/admin/dashboard/dashboard.component";
import { SidenavComponent } from "src/app/features/admin/layout/sidenav/sidenav.component";
import { DanhmucModule } from "./danhmuc/danhmuc.module";

@NgModule({
  declarations: [SidenavComponent, AdminComponent, DashboardComponent],
  imports: [
    CommonModule,
    QuantriRoutingModule,
    MapModule,
    ThongkeModule,
    BaocaoModule,
    DanhmucModule,
    AdminSharedModule,
    ThietlapModule,
    ThuvienModule,
    HethongModule,
    ErrorModule,
    SimplebarAngularModule,
  ],
  providers: [],
  entryComponents: [],
})
export class AdminModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
