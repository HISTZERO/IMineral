import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef,} from "@angular/core";
import {MatSidenav} from "@angular/material/sidenav";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {QueryCellInfoEventArgs, TextWrapSettingsModel, GridComponent} from "@syncfusion/ej2-angular-grids";

import {OutputDmDvhcModel} from "src/app/models/admin/danhmuc/dvhc.model";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {ServiceName} from "src/app/shared/constants/service-name";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {GlobalVar} from "src/app/shared/constants/global-var";
import {
  _addTinhAction,
  _listTinhAction,
  _editTinhAction,
  _deleteTinhAction,
  _addHuyenAction,
  _listHuyenAction,
  _editHuyenAction,
  _deleteHuyenAction,
  _addXaAction,
  _listXaAction,
  _editXaAction,
  _deleteXaAction
} from "src/app/shared/constants/actions/danhmuc/dvhc";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {MenuDanhMucDVHC} from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import {DmDvhcIoComponent} from "src/app/features/admin/danhmuc/dvhc/dvhc-io/dvhc-io.component";
import {TrangThai} from "src/app/shared/constants/trangthai-constants";
import {TrangThaiEnum} from "src/app/shared/constants/enum";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";


@Component({
  selector: "app-dvhc-list",
  templateUrl: "./dvhc-list.component.html",
  styleUrls: ["./dvhc-list.component.scss"],
})
export class DmDvhcListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridDvhcTinh", {static: false}) public gridDvhcTinh: GridComponent;
  @ViewChild("gridDvhcHuyen", {static: false}) public gridDvhcHuyen: GridComponent;
  @ViewChild("gridDvhcXa", {static: false}) public gridDvhcXa: GridComponent;
  @ViewChild("aside", {static: true}) public matSidenav: MatSidenav;
  @ViewChild("componentdvhcio", {read: ViewContainerRef, static: true}) public content: ViewContainerRef;

  // Danh sách dvhc Tỉnh
  public listDataDvhcProvince: OutputDmDvhcModel[];

  // Danh sách dvhc Huyện
  public listDatadvhcDistrict: OutputDmDvhcModel[];

  // Danh sách dvhc Xã
  public listDatadvhcWard: OutputDmDvhcModel[];

  // Chứa item được chọn
  public selectedItem: OutputDmDvhcModel;

  // Biến ẩn Tỉnh
  public disabledDistrict = true;

  // Biến ẩn Huyện
  public disabledWard = true;

  // Chứa tên xóa
  public deleteName: string;

  // Chứa mảng menu item trên subheader
  public navArray = MenuDanhMucDVHC;

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Các biến translate
  public dataTranslate: any;

  // Chứa setting dùng chung
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item Tỉnh đã chọn
  public listDataSelectProvince: any[];

  // Chứa danh sách item Huyện đã chọn
  public listDataSelectDistrict: any[];

  // Chứa danh sách item Xã đã chọn
  public listDataSelectWard: any[];

  // Chứa trạng thái của nhóm nút trạng thái
  public disableButtonProvince = false;

  // Chứa trạng thái của nhóm nút trạng thái
  public disableButtonDistrict = false;

  // Chứa trạng thái của nhóm nút trạng thái
  public disableButtonWard = false;

  // Chứa enum Trạng thái
  public statusEnum = TrangThaiEnum;

  // Chứa id Tỉnh
  public idTinh: string;

  // Chứa id Huyện
  public idHuyen: string;

  public trangthaiProvince: string;
  public trangthaiDistrict: string;
  public trangthaiWard: string;

  // Danh sách các quyền
  addTinhAction = _addTinhAction;
  listTinhAction = _listTinhAction;
  editTinhAction = _editTinhAction;
  deleteTinhAction = _deleteTinhAction;
  addHuyenAction = _addHuyenAction;
  listHuyenAction = _listHuyenAction;
  editHuyenAction = _editHuyenAction;
  deleteHuyenAction = _deleteHuyenAction;
  addXaAction = _addXaAction;
  listXaAction = _listXaAction;
  editXaAction = _editXaAction;
  deleteXaAction = _deleteXaAction;


  constructor(
    public dmFacadeSv: DmFacadeService,
    public matsidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public generalClientService: GeneralClientService
  ) {
  }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = {wrapMode: 'Both'};
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.matsidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.settingsCommon.toolbar = ["Search"];
    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getPageSize();
    await this.bindingConfig();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
  }

  // binding config
  async bindingConfig() {
    await this.getAllProvince();
  }

  // get list province
  async getAllProvince() {
    if (this.listDataDvhcProvince != null && this.listDataDvhcProvince.length > 0) {
      this.gridDvhcTinh.clearSelection();
    }
    const listData: any = await this.dmFacadeSv
      .getProvinceService()
      .getFetchAll();
    if (listData) {
      listData.map((tinh, index) => {
        tinh.serialNumber = index + 1;
      });
    }
    this.listDataDvhcProvince = listData;
  }

  // get district
  async getDistrict(idtinh: string) {
    this.idTinh = idtinh;
    if (this.listDatadvhcDistrict != null && this.listDatadvhcDistrict.length > 0) {
      this.gridDvhcHuyen.clearSelection();
    }
    const listDataItems: any = await this.dmFacadeSv
      .getDistrictService()
      .getFetchAll({IdTinh: this.idTinh});
    if (listDataItems) {
      listDataItems.map((huyen, index) => {
        huyen.serialNumber = index + 1;
      });
    }
    this.listDatadvhcDistrict = listDataItems;
  }

  // get ward
  async getWard(idhuyen: string) {
    this.idHuyen = idhuyen;
    if (this.listDatadvhcWard != null && this.listDatadvhcWard.length > 0) {
      this.gridDvhcXa.clearSelection();
    }
    const listDataItems: any = await this.dmFacadeSv
      .getWardService()
      .getFetchAll({IdHuyen: idhuyen});
    if (listDataItems) {
      listDataItems.map((xa, index) => {
        xa.serialNumber = index + 1;
      });
    }
    this.listDatadvhcWard = listDataItems;
  }

  // childTinh
  public childProvince(event) {
    this.getChildProvinceByEvent(event);
    this.disabledDistrict = false;
    this.listDatadvhcWard = [];
    this.disabledWard = true;
  }

  // child Huyen
  public childDistrict(event) {
    this.getChildDistrictByEvent(event);
    this.disabledWard = false;
  }

  // get Child Province by event
  private getChildProvinceByEvent(data) {
    this.selectedItem = null;
    this.trangthaiDistrict = "";
    this.getDistrict(data.id);
    this.selectedItem = data;
    GlobalVar.provinceSelected = data.ten;
  }

  // get child district by event
  private getChildDistrictByEvent(data) {
    this.selectedItem = null;
    this.trangthaiWard = "";
    this.getWard(data.id);
    this.selectedItem = data;
    GlobalVar.districtSelected = data.ten;
  }

  // Open sidebar add Province
  public openDvhcProvinceIOSidebar() {
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleAddProvince, DmDvhcIoComponent, "newProvince");
    this.listDatadvhcDistrict = [];
    this.listDatadvhcWard = [];
    this.disabledDistrict = true;
    this.disabledWard = true;
  }

  // open sidebar add District
  public openDvhcDistrictIOSidebar() {
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleAddDistrict, DmDvhcIoComponent, "newDistrict", this.selectedItem);
    this.listDatadvhcWard = [];
    this.disabledWard = true;
  }

  // open sidebar add ward
  public openDvhcWardIOSidebar() {
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleAddWard, DmDvhcIoComponent, "newWard", this.selectedItem);
  }

  // open sidebar edit Province
  public openDvhcEditProvince(event: any) {
    this.selectedItem = event;
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleEditProvince, DmDvhcIoComponent, "editProvince", this.selectedItem);
  }

  // open sidebar edit district
  public openDvhcEditDistrict(event: any) {
    this.selectedItem = event;
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleEditDistrict, DmDvhcIoComponent, "editDistrict", this.selectedItem);
  }

  // open sidebar edit ward
  public openDvhcEditWard(event: any) {
    this.selectedItem = event;
    this.setValueSidebar(this.dataTranslate.DANHMUC.dvhc.titleEditWard, DmDvhcIoComponent, "editWard", this.selectedItem);
  }

  // get item by envent
  public getItemByEvent(event: any, listData: any) {
    this.selectedItem = null;
    const data = this.commonService.getByEvent(event, listData);
    this.selectedItem = data;
  }

  // set value open/edit sidebar
  public setValueSidebar(title: string, component: any, editMode: string, item?: any) {
    this.matsidenavService.setTitle(title);
    this.matsidenavService.setContentComp(component, editMode, item);
    this.matsidenavService.open();
  }

  // refresh grid district
  public refreshGridDistrict() {
    this.getDistrict(this.idTinh);
  }

  // resfresh grid ward
  public refreshGridWard() {
    this.getWard(this.idHuyen);
  }

  // close
  public closeDvhcIOSidebar() {
    this.matsidenavService.close();
  }

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === 'check') {
      args.cell.classList.add('style-checkbox');
    }
    if (args.column.field === 'id') {
      args.cell.classList.add('style-action');
    }
    if (args.column.field === 'ten') {
      args.cell.classList.add('style-dvhc');
    }
    if (
      args.column.field === ServiceName.ID_DVHC ||
      args.column.field === ServiceName.TEN_DVHC
    ) {
      args.cell.id = args.data[ServiceName.ID_DVHC];
    }
  }

  doFunction(methodName) {
    this[methodName]();
  }

  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItem(data: any) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeSv
      .getDmDvhcService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }

  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.dvhc.contentDelete,
      this.selectedItem.ten
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>([this.selectedItem], "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.dvhc.nameofobject + " (" + data.ten + ") " + this.dataTranslate.DANHMUC.dvhc.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.dvhc.informedDialogTitle
          );
        } else {
          await this.dmFacadeSv
            .getDmDvhcService()
            .deleteItem({idDvhc: this.selectedItem.id})
            .subscribe(
              () => {
                if (this.selectedItem.parentid === null) {
                  this.getAllProvince();
                } else {
                  if (this.selectedItem.maxa === '00000') {
                    this.getDistrict(this.selectedItem.parentid);
                  } else {
                    this.getWard(this.selectedItem.parentid);
                  }
                }
              },
              (error: HttpErrorResponse) => {
                this.commonService.showDialogWarning(error.error.errors);
              },
              () =>
                this.commonService.showeNotiResult(
                  this.dataTranslate.COMMON.default.successDelete,
                  2000
                )
            );
        }
      }
    });
  }

  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  /**
   * Hàm lấy danh sách dữ liệu Dvhc Tỉnh đã chọn trên grid
   */
  public getAllDataSelectProvince() {
    this.listDataSelectProvince = this.gridDvhcTinh.getSelectedRecords();
    this.checkDisableButtonProvince();
  }

  /**
   * Hàm check disable button active, unactive, delete multi items
   */
  public checkDisableButtonProvince() {
    if (this.listDataSelectProvince.length > 0) {
      this.disableButtonProvince = true;
    } else {
      this.disableButtonProvince = false;
    }
  }

  /**
   * Hàm lấy danh sách dữ liệu Dvhc Huyện đã chọn trên grid
   */
  public getAllDataSelectDistrict() {
    this.listDataSelectDistrict = this.gridDvhcHuyen.getSelectedRecords();
    this.checkDisableButtonDistrict();
  }

  /**
   * Hàm check disable button active, unactive, delete multi items
   */
  public checkDisableButtonDistrict() {
    if (this.listDataSelectDistrict.length > 0) {
      this.disableButtonDistrict = true;
    } else {
      this.disableButtonDistrict = false;
    }
  }

  /**
   * Hàm lấy danh sách dữ liệu Dvhc Tỉnh đã chọn trên grid
   */
  public getAllDataSelectWard() {
    this.listDataSelectWard = this.gridDvhcXa.getSelectedRecords();
    this.checkDisableButtonWard();
  }

  /**
   * Hàm check disable button active, unactive, delete multi items
   */
  public checkDisableButtonWard() {
    if (this.listDataSelectWard.length > 0) {
      this.disableButtonWard = true;
    } else {
      this.disableButtonWard = false;
    }
  }

  /**
   * Hàm cấu hình dữ liệu thay đổi trạng thái
   * @param status
   */
  public changeStatus(status: any, listData: any, dvhc: string) {
    const dataParam: any = {
      listStatus: listData,
      status
    };
    this.ActiveOrUnActiveArrayItem(dataParam, dvhc);
  }

  /**
   * Hàm unActive mảng item đã chọn
   */
  public ActiveOrUnActiveArrayItem(data: any, dvhc) {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.dvhc.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        this.dmFacadeSv.getDmDvhcService()
          .updateStatusItems(data)
          .subscribe(
            () => {
              if (dvhc === "province") {
                this.trangthaiProvince = "";
                this.getAllProvince();
              } else {
                if (dvhc === 'district') {
                  this.trangthaiDistrict = "";
                  this.refreshGridDistrict();
                } else {
                  if (dvhc === 'ward') {
                    this.trangthaiWard = "";
                    this.refreshGridWard();
                  }
                }
              }
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.updateStatusSuccess,
                2000
              ));
      }
    });
  }

  /**
   * Hàm delete mảng item đã chọn
   */
  public deleteArrayItem(listData: any[], dvhc: string) {
    const idItems: string[] = [];
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.dvhc.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(listData, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.dvhc.nameofobject + " (" + data.ten + ") " + this.dataTranslate.DANHMUC.dvhc.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.dvhc.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => {
          });
        } else {
          listData.map(res => {
            idItems.push(res.id);
          });
          const dataBody: any = {
            listId: idItems,
          };
          this.dmFacadeSv.getDmDvhcService()
            .deleteArrayItems(dataBody)
            .subscribe(
              () => {
                if (dvhc === "province") {
                  this.getAllProvince();
                } else {
                  if (dvhc === 'district') {
                    this.refreshGridDistrict();
                  } else {
                    if (dvhc === 'ward') {
                      this.refreshGridWard();
                    }
                  }
                }
              },
              (error: HttpErrorResponse) => {
                this.commonService.showDialogWarning(error.error.errors);
              },
              () =>
                this.commonService.showeNotiResult(
                  this.dataTranslate.COMMON.default.successDelete,
                  2000
                ));
        }
      }
    });
  }

  async getAllProvinceByTrangThai(event) {
      if (this.listDataDvhcProvince != null && this.listDataDvhcProvince.length > 0) {
        this.gridDvhcTinh.clearSelection();
      }
      const listData: any = await this.dmFacadeSv
        .getProvinceService()
        .getFetchAll({Trangthai: event.value});
      if (listData) {
        listData.map((tinh, index) => {
          tinh.serialNumber = index + 1;
        });
      }
      this.listDataDvhcProvince = listData;

  }

  async getDistrictByTrangThai(event) {
    if (this.listDatadvhcDistrict != null && this.listDatadvhcDistrict.length > 0) {
      this.gridDvhcHuyen.clearSelection();
    }
    const listDataItems: any = await this.dmFacadeSv
      .getDistrictService()
      .getFetchAll({IdTinh: this.idTinh, Trangthai: event.value});
    if (listDataItems) {
      listDataItems.map((huyen, index) => {
        huyen.serialNumber = index + 1;
      });
    }
    this.listDatadvhcDistrict = listDataItems;
  }

  async getWardByTrangThai(event) {

    if (this.listDatadvhcWard != null && this.listDatadvhcWard.length > 0) {
      this.gridDvhcXa.clearSelection();
    }
    const listDataItems: any = await this.dmFacadeSv
      .getWardService()
      .getFetchAll({IdHuyen: this.idHuyen, Trangthai: event.value});
    if (listDataItems) {
      listDataItems.map((xa, index) => {
        xa.serialNumber = index + 1;
      });
    }
    this.listDatadvhcWard = listDataItems;
  }
}
