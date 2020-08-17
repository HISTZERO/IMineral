import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { MenuDanhMucCoQuanQuanLy } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CoquanquanlyIoComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-io/coquanquanly-io.component";

@Component({
  selector: 'app-coquanquanly-list',
  templateUrl: './coquanquanly-list.component.html',
  styleUrls: ['./coquanquanly-list.component.scss']
})
export class CoquanquanlyListComponent implements OnInit {

   // Viewchild template
   @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
   @ViewChild("compCoQuanQuanLyIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
 
   // Chứa thiết lập grid
   public settingsCommon = new SettingsCommon();
 
   // Chứa danh sách Cơ quan quản lý
   public listCoQuanQuanLy: OutputCoQuanQuanLyModel[];
 
   // Chứa dữ liệu đã chọn 
   public selectedItem: OutputCoQuanQuanLyModel;
 
   // Chứa dữ liệu translate
   public dataTranslate: any;
 
   // Chứa menu item trên subheader
   public navArray = MenuDanhMucCoQuanQuanLy;
 
   // Contructor
   constructor(
     public matSidenavService: MatsidenavService,
     public cfr: ComponentFactoryResolver,
     public dmFacadeService: DmFacadeService,
     public commonService: CommonServiceShared,
     public thietlapFacadeService: ThietlapFacadeService,
     private translate: TranslateService
   ) { }
 
   async ngOnInit() {
     // Gọi hàm lấy dữ liệu translate
     await this.getDataTranslate();
     // Khởi tạo sidenav
     this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
     // Gọi hàm lấy dữ liệu pagesize
     await this.getDataPageSize();
   }
 
   /**
    * Hàm lấy dữ liệu translate
    */
   async getDataTranslate() {
     // Get all langs
     this.dataTranslate = await this.translate
     .getTranslation(this.translate.getDefaultLang())
     .toPromise();
   }
 
   /**
    * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
    */
   async getDataPageSize() {
     const pageSize: any = await this.thietlapFacadeService
     .getThietLapHeThongService()
     .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
     if (pageSize) {
       this.settingsCommon.pageSettings.pageSize = +pageSize;
     } else {
       this.settingsCommon.pageSettings.pageSize = 10;
     }
     // Gọi hàm lấy dữ liệu cơ quan quản lý
     await this.getAllCoQuanQuanLy();
   }
 
   /**
    * Hàm lấy dữ liệu Cơ Quan Quản Lý
    */
   async getAllCoQuanQuanLy() {
     const listData: any = await this.dmFacadeService
       .getCoQuanQuanLyService()
       .getFetchAll({ PageNumber: 1, PageSize: -1 });
     if (listData.items) {
       listData.items.map((coquan, index) => {
         coquan.serialNumber = index + 1;
       });
     }
     this.listCoQuanQuanLy = listData.items;
   }
 
   /**
    * Hàm mở sidenav chức năng sửa dữ liệu
    * @param id
    */
   async editItemCoQuanQuanLy(id: number) {
     // Lấy dữ liệu cơ quan quản lý theo id
     const dataItem: any = await this.dmFacadeService
     .getCoQuanQuanLyService()
     .getByid(id).toPromise();
     await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.coquanquanly.titleEdit );
     await this.matSidenavService.setContentComp( CoquanquanlyIoComponent, "edit", dataItem);
     await this.matSidenavService.open();
   }
 
   /**
    * Hàm mở sidenav chức năng thêm mới
    */
   public openCoQuanQuanLyIOSidenav() {
     this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.coquanquanly.titleAdd);
     this.matSidenavService.setContentComp( CoquanquanlyIoComponent, "new");
     this.matSidenavService.open();
   }
 
   /**
    * Hàm đóng sidenav
    */
   public closeCoQuanQuanLyIOSidenav() {
     this.matSidenavService.close();
   }
 
 
   /**
    *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
    */
   async deleteItemCoQuanQuanLy(data) {
     this.selectedItem = data;
     // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
     // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
     // Nếu đồng ý xóa
     const canDelete: string = this.dmFacadeService
       .getCoQuanQuanLyService()
       .checkBeDeleted(+this.selectedItem.idcoquanquanly);
     this.canBeDeletedCheck(canDelete);
   }
 
   /**
    * Hàm check điều kiện xóa bản ghi
    * @param sMsg 
    */
   public canBeDeletedCheck(sMsg: string) {
     if (sMsg === "ok") {
       this.confirmDeleteDiaLog();
     } else {
       this.cantDeleteDialog(sMsg);
     }
   }
 
   /** 
    * Hàm thực hiện chức năng xóa bản ghi và thông báo xóa thành công
    */
   confirmDeleteDiaLog() {
     const dialogRef = this.commonService.confirmDeleteDiaLogService(
       this.dataTranslate.DANHMUC.coquanquanly.contentDelete,
       this.selectedItem.tencoquanquanly
     );
     dialogRef.afterClosed().subscribe(async (result) => {
       if (result === "confirm") {
         await this.dmFacadeService
           .getCoQuanQuanLyService()
           .deleteItem({ idCoquanquanly: this.selectedItem.idcoquanquanly })
           .subscribe(
             () => this.getAllCoQuanQuanLy(),
             (error: HttpErrorResponse) => {
               this.commonService.showeNotiResult(error.message, 2000);
             },
             () =>
               this.commonService.showeNotiResult(
                 this.dataTranslate.COMMON.default.successDelete,
                 2000
               )
           );
       }
     });
   }
 
   /**
    * Hàm thông báo không thể xóa
    */
   cantDeleteDialog(sMsg: string) {
     this.commonService.canDeleteDialogService(sMsg);
   }
 
   // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
   doFunction(methodName) {
     this[methodName]();
   }
}
