import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef,} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { QueryCellInfoEventArgs, TextWrapSettingsModel, GridComponent } from "@syncfusion/ej2-angular-grids";

import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import { ServiceName } from "src/app/shared/constants/service-name";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { GlobalVar } from "src/app/shared/constants/global-var";
import { _addTinhAction, _listTinhAction, _editTinhAction, _deleteTinhAction, _addHuyenAction, _listHuyenAction, _editHuyenAction, _deleteHuyenAction, _addXaAction, _listXaAction, _editXaAction, _deleteXaAction} from "src/app/shared/constants/actions/danhmuc/dvhc";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MenuDanhMucDVHC } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { DmDvhcIoComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-io/dvhc-io.component";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";

@Component({
  selector: "app-dvhc-list",
  templateUrl: "./dvhc-list.component.html",
  styleUrls: ["./dvhc-list.component.scss"],
})
export class DmDvhcListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridDvhcTinh", { static: false }) public gridDvhcTinh: GridComponent;
  @ViewChild("gridDvhcHuyen", { static: false }) public gridDvhcHuyen: GridComponent;
  @ViewChild("gridDvhcXa", { static: false }) public gridDvhcXa: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("componentdvhcio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Danh sách dvhc Tỉnh
  listDataDvhcProvince: OutputDmDvhcModel[];

  // Danh sách dvhc Huyện
  listDatadvhcDistrict: OutputDmDvhcModel[];

  // Danh sách dvhc Xã
  listDatadvhcWard: OutputDmDvhcModel[];

  // Chứa item được chọn
  selectedItem: OutputDmDvhcModel;

  // Biến ẩn Tỉnh
  disabledDistrict = true;

  // Biến ẩn Huyện
  disabledWard = true;

  // Chứa tên xóa
  deleteName: string;

  // Chứa mảng menu item trên subheader
  navArray = MenuDanhMucDVHC;

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Các biến translate
  public dataTranslate: any;
  
  // Chứa setting dùng chung
  settingsCommon = new SettingsCommon();
 

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
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
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
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // binding config
  async bindingConfig() {
    await this.getAllProvince();
  }

  // get list province
  async getAllProvince() {
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
    const listDataItems: any = await this.dmFacadeSv
      .getDistrictService()
      .getByid(idtinh).toPromise();
    if (listDataItems) {
      listDataItems.map((huyen, index) => {
        huyen.serialNumber = index + 1;
      });
    }
    this.listDatadvhcDistrict = listDataItems;
  }

  // get ward
  async getWard(idhuyen: string) {
    const listDataItems: any = await this.dmFacadeSv
      .getWardService()
      .getByid(idhuyen).toPromise();
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
    this.getDistrict(data.id);
    this.selectedItem = data;
    GlobalVar.provinceSelected = data.ten;
  }

  // get child district by event
  private getChildDistrictByEvent(data) {
    this.selectedItem = null;
    this.getWard(data.id);
    this.selectedItem = data;
    GlobalVar.districtSelected = data.ten;
  }

  // Open sidebar add Province
  public openDvhcProvinceIOSidebar() {
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleAddProvince, DmDvhcIoComponent, "newProvince");
    this.listDatadvhcDistrict = [];
    this.listDatadvhcWard = [];
    this.disabledDistrict = true;
    this.disabledWard = true;
  }

  // open sidebar add District
  public openDvhcDistrictIOSidebar() {
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleAddDistrict, DmDvhcIoComponent, "newDistrict", this.selectedItem);
    this.listDatadvhcWard = [];
    this.disabledWard = true;
  }

  // open sidebar add ward
  public openDvhcWardIOSidebar() {
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleAddWard, DmDvhcIoComponent, "newWard", this.selectedItem);
  }

  // open sidebar edit Province
  public openDvhcEditProvince(event: any) {
    this.selectedItem = event;
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleEditProvince, DmDvhcIoComponent, "editProvince", this.selectedItem);
  }

  // open sidebar edit district
  public openDvhcEditDistrict(event: any) {
    this.selectedItem = event;
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleEditDistrict, DmDvhcIoComponent, "editDistrict", this.selectedItem);
  }

  // open sidebar edit ward
  public openDvhcEditWard(event: any) {
    this.selectedItem = event;
    this.setValueSidebar( this.dataTranslate.DANHMUC.dvhc.titleEditWard, DmDvhcIoComponent, "editWard",this.selectedItem);
  }

  // get item by envent
  public getItemByEvent(event: any, listData: any) {
    this.selectedItem = null;
    const data = this.commonService.getByEvent(event, listData);
    this.selectedItem = data;
  }

  // set value open/edit sidebar
  public setValueSidebar( title: string, component: any, editMode: string, item?: any) {
    this.matsidenavService.setTitle(title);
    this.matsidenavService.setContentComp(component, editMode, item);
    this.matsidenavService.open();
  }

  // refresh grid district
  public refreshGridDistrict() {
    this.getDistrict(this.selectedItem.matinh);
  }

  // resfresh grid ward
  public refreshGridWard() {
    this.getWard(this.selectedItem.mahuyen);
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
    if (args.column.field === 'serialNumber') {
      args.cell.classList.add('style-stt');
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
  async deleteItemProvince(data: any) {
    this.selectedItem = data;
    this.deleteName = "province";
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeSv
      .getProvinceService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }
  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemDistrict(data: any) {
    this.selectedItem = data;
    this.deleteName = "District";
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeSv
      .getDistrictService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }
  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemWard(data: any) {
    this.selectedItem = data;
    this.deleteName = "Ward";
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeSv
      .getWardService()
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
        if (this.deleteName === "province") {
          await this.dmFacadeSv
            .getProvinceService()
            .deleteItem({ id: this.selectedItem.id })
            .subscribe(
              () => this.getAllProvince(),
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
        if (this.deleteName === "District") {
          await this.dmFacadeSv
            .getDistrictService()
            .deleteItem({ id: this.selectedItem.id })
            .subscribe(
              () => this.getDistrict(this.selectedItem.matinh),
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
        if (this.deleteName === "Ward") {
          await this.dmFacadeSv
            .getWardService()
            .deleteItem({ id: this.selectedItem.id })
            .subscribe(
              () => this.getWard(this.selectedItem.mahuyen),
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
      }
    });
  }

  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }
}
