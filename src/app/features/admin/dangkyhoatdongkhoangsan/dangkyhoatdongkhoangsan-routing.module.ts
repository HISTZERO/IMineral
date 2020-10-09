import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { ThamdokhoangsanListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component'
import { ThamdokhoangsanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-io/thamdokhoangsan-io.component';
import { KhaithackhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/khaithackhoangsan-list/khaithackhoangsan-list.component";
import { KhaithackhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/khaithackhoangsan-io/khaithackhoangsan-io.component";
import { TanthukhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/tanthukhoangsan-list/tanthukhoangsan-list.component";
import { TanthukhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/tanthukhoangsan-io/tanthukhoangsan-io.component";
import { TralaigiayphepListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tralaigiayphep/tralaigiayphep-list/tralaigiayphep-list.component";
import { TralaigiayphepIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tralaigiayphep/tralaigiayphep-io/tralaigiayphep-io.component";
import { DongcuamoListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dongcuamo-list/dongcuamo-list.component";
import { DongcuamoIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dongcuamo-io/dongcuamo-io.component";
import { ChuyennhuongquyenListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/chuyennhuongquyen-list/chuyennhuongquyen-list.component";
import { ChuyennhuongquyenIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/chuyennhuongquyen-io/chuyennhuongquyen-io.component";
import { PheduyettruluongkhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/pheduyettruluongkhoangsan/pheduyettruluongkhoangsan-list/pheduyettruluongkhoangsan-list.component";
import { PheduyettruluongkhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/pheduyettruluongkhoangsan/pheduyettruluongkhoangsan-io/pheduyettruluongkhoangsan-io.component";
import { DaugiaquyenListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/daugiaquyen/daugiaquyen-list/daugiaquyen-list.component";
import { DaugiaquyenIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/daugiaquyen/daugiaquyen-io/daugiaquyen-io.component";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: AdminRoutingName.dkthamdokhoangsanUri, component: ThamdokhoangsanListComponent },
          { path: AdminRoutingName.dkthamdokhoangsanchitietUri, component: ThamdokhoangsanIoComponent },
          { path: AdminRoutingName.dkKhaithackhoangsanUri, component: KhaithackhoangsanListComponent },
          { path: AdminRoutingName.dkKhaithackhoangsanChitiet, component: KhaithackhoangsanIoComponent },
          { path: AdminRoutingName.dkTanthukhoangsanUri, component: TanthukhoangsanListComponent },
          { path: AdminRoutingName.dkTanthukhoangsanChiTiet, component: TanthukhoangsanIoComponent },
          { path: AdminRoutingName.dkTralaigiayphepUri, component: TralaigiayphepListComponent },
          { path: AdminRoutingName.dkTralaigiayphepChiTiet, component: TralaigiayphepIoComponent },
          { path: AdminRoutingName.dkDongcuamoUri, component: DongcuamoListComponent },
          { path: AdminRoutingName.dkDongcuamoChiTiet, component: DongcuamoIoComponent },
          { path: AdminRoutingName.dkChuyennhuongquyenUri, component: ChuyennhuongquyenListComponent },
          { path: AdminRoutingName.dkChuyennhuongquyenChiTiet, component: ChuyennhuongquyenIoComponent },
          { path: AdminRoutingName.dkPheDuyetTruLuongUri, component: PheduyettruluongkhoangsanListComponent },
          { path: AdminRoutingName.dkPheDuyetTruLuongChitiet, component: PheduyettruluongkhoangsanIoComponent },
          { path: AdminRoutingName.dkDauGiaQuyenUri, component: DaugiaquyenListComponent },
          { path: AdminRoutingName.dkDauGiaQuyenChitiet, component: DaugiaquyenIoComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DangkyhoatdongkhoangsanRoutingModule { }
