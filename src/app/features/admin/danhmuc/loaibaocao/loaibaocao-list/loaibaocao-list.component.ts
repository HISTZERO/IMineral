import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { MenuDanhMucLoaiBaoCao } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmLoaibaocaoIoComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-io/loaibaocao-io.component";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging } from "src/app/shared/constants/enum";

@Component({
  selector: 'app-loaibaocao-list',
  templateUrl: './loaibaocao-list.component.html',
  styleUrls: ['./loaibaocao-list.component.scss']
})
export class DmLoaibaocaoListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridLoaiBaoCao", { static: false }) public gridLoaiBaoCao: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compLoaiBaoCaoIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
 
  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();
 
  // Chứa danh sách Loại Báo Cáo
  public listLoaiBaoCao: OutputDmLoaiBaoCaoModel[];
 
  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmLoaiBaoCaoModel;
 
  // Chứa dữ liệu translate
  public dataTranslate: any;
 
  // Chứa menu item trên subheader
  public navArray = MenuDanhMucLoaiBaoCao;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];
  
  //Chứa data Trạng thái
  public trangthai = TrangThai;

  // disable delete button
  public disableDeleteButton = false;

  // disable active button
  public disableActiveButton = false;

  // disable unactive button
  public disableUnActiveButton = false;
 
   // Contructor
   constructor(
     public matSidenavService: MatsidenavService,
     public cfr: ComponentFactoryResolver,
     public dmFacadeService: DmFacadeService,
     public commonService: CommonServiceShared,
     public thietlapFacadeService: ThietlapFacadeService,
     private translate: TranslateService,
     public generalClientService: GeneralClientService,
     public formBuilder: FormBuilder
   ) { }
 
   async ngOnInit() {
     // Khởi tạo form
     this.formInit();
     this.setDisplayOfCheckBoxkOnGrid(true);
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
     // Gọi hàm lấy dữ liệu Loại báo cáo
     await this.getAllLoaiBaoCao();
   }
 
   /**
    * Hàm lấy dữ liệu Loại báo cáo
    */
   async getAllLoaiBaoCao(param: any = { PageNumber: 1, PageSize: -1 }) {
     const listData: any = await this.dmFacadeService
       .getDmLoaiBaoCaoService()
       .getFetchAll(param);
     if (listData.items) {
       listData.items.map((loaibaocao, index) => {
         loaibaocao.serialNumber = index + 1;
       });
     }
     this.listLoaiBaoCao = listData.items;
   }
 

      /**
       * Hàm thiết lập hiển thị hoặc ẩn checkbox trên grid
       */

      async setDisplayOfCheckBoxkOnGrid(status: boolean = false) {
        if (status) {
          this.settingsCommon.selectionOptions = { persistSelection: true };
        } else {
          this.settingsCommon.selectionOptions = null;
        }
      }

      /**
       * Form innit
       */
      public formInit() {
        this.formSearch = this.formBuilder.group({
          Keyword: [""],
          Trangthai: [""]
        });
      }

      /**
      * Tìm kiếm nâng cao
      */
    public searchAdvance() {
      let dataSearch = this.formSearch.value;
      dataSearch['PageNumber'] = Paging.PageNumber;
      dataSearch['PageSize'] = Paging.PageSize;
      this.getAllLoaiBaoCao(dataSearch);
    }

    /**
     * Hàm lấy danh sách dữ liệu đã chọn trên grid
     */
    public getAllDataActive() {
      this.listDataSelect = this.gridLoaiBaoCao.getSelectedRecords();

      if (this.listDataSelect.length > 0) {
        this.disableActiveButton = true;
        this.disableDeleteButton = true;
        this.disableUnActiveButton = true;
      } else {
        this.disableActiveButton = false;
        this.disableDeleteButton = false;
        this.disableUnActiveButton = false;
      }
    }

    /**
     * Hàm unActive mảng item đã chọn
     */
    public unActiveArrayItem() {
      const dialogRef = this.commonService.confirmDeleteDiaLogService("", "",  this.dataTranslate.DANHMUC.loaibaocao.confirmedContentOfUnActiveDialog);
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === "confirm") {

        }
      });
    }

    /**
     * Hàm active mảng item đã chọn
     */
    public activeArrayItem() {
      const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.loaibaocao.confirmedContentOfActiveDialog);
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === "confirm") {
          if (this.listDataSelect.length === 0) {

          }
        }
      });
    }

    /**
     * Hàm delete mảng item đã chọn
     */
    public deleteArrayItem() {
      const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.linhvuc.confirmedContentOfDeleteDialog);
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === "confirm") {
          const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

          if (data !== null) {
            const informationDialogRef = this.commonService.informationDiaLogService(
              "",
              this.dataTranslate.DANHMUC.loaibaocao.nameofobject + " (" + data.tenloaibaocao + ") " + this.dataTranslate.DANHMUC.loaibaocao.informedContentOfUnDeletedDialog,
              this.dataTranslate.DANHMUC.loaibaocao.informedDialogTitle,
            );

            informationDialogRef.afterClosed().subscribe(() => {});
          }
        }
      });
    }

   /**
    * Hàm mở sidenav chức năng sửa dữ liệu
    * @param id
    */
   async editItemLoaiBaoCao(id: string) {
     // Lấy dữ liệu loại báo cáo theo id
     const dataItem: any = await this.dmFacadeService
     .getDmLoaiBaoCaoService()
     .getByid(id).toPromise();
     await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.loaibaocao.titleEdit );
     await this.matSidenavService.setContentComp( DmLoaibaocaoIoComponent, "edit", dataItem);
     await this.matSidenavService.open();
   }
 
   /**
    * Hàm mở sidenav chức năng thêm mới
    */
   public openLoaiBaoCaoIOSidenav() {
     this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.loaibaocao.titleAdd);
     this.matSidenavService.setContentComp(DmLoaibaocaoIoComponent, "new");
     this.matSidenavService.open();
   }
 
   /**
    * Hàm đóng sidenav
    */
   public closeLoaiBaoCaoIOSidenav() {
     this.matSidenavService.close();
   }
 
 
   /**
    *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
    */
   async deleteItemLoaiBaoCao(data) {
     this.selectedItem = data;
     // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
     // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
     // Nếu đồng ý xóa
     const canDelete: string = this.dmFacadeService
       .getDmLoaiBaoCaoService()
       .checkBeDeleted(+this.selectedItem.idloaibaocao);
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
       this.dataTranslate.DANHMUC.loaibaocao.contentDelete,
       this.selectedItem.tenloaibaocao
     );
     dialogRef.afterClosed().subscribe(async (result) => {
       if (result === "confirm") {
         await this.dmFacadeService
           .getDmLoaiBaoCaoService()
           .deleteItem({ idLoaibaocao: this.selectedItem.idloaibaocao })
           .subscribe(
             () => this.getAllLoaiBaoCao(),
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