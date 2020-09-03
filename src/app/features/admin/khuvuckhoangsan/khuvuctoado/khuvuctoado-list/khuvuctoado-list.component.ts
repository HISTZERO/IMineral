import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { KhuvuctoadoIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuctoado/khuvuctoado-io/khuvuctoado-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "../../../../../services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { ActivatedRoute } from "@angular/router";
import {KhuVucKhoangSanEnum, MaLoaiHinhEnum, keyKhuVucKhoangSan} from "src/app/shared/constants/khuvuckhoangsan-constants";
import { OutputKhuVucToaDoModel } from 'src/app/models/admin/khuvuckhoangsan/khuvuctoado.model';

@Component({
  selector: 'app-khuvuctoado-list',
  templateUrl: './khuvuctoado-list.component.html',
  styleUrls: ['./khuvuctoado-list.component.scss']
})
export class KhuvuctoadoListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridToaDo", { static: false }) public gridToaDo: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compToaDoIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách khu vực tọa độ
  public listToaDo: OutputKhuVucToaDoModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucToaDoModel;

  // Chứa dữ liệu đã chọn
  public thongTinKhuVucKhoangSan: any;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa key khu vực khoáng sản
  public keyKhuVuc: string;

  // Chứa id khu vực khoáng sản
  public idKhuVuc: string;

  public loaikhuvuc: number;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public kvKhoangSanFacadeSv: KhuVucKhoangSanFacadeService,
    public activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.keyKhuVuc = param.params.keykhuvuc;
      this.idKhuVuc = param.params.idkhuvuc;
    });
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );

    // Gọi hàm lấy thông tin dữ liệu khu vực khoáng sản
    await this.getThongTinKhuVucKhoangSan();

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
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize ).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu tọa độ
    await this.getAllToaDo();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllToaDo();
  }

  /*
   * Hàm get thông tin khu vực khoáng sản
   */
  async getThongTinKhuVucKhoangSan() {
    if ((this.keyKhuVuc !== keyKhuVucKhoangSan.KhuVucCamTamCam
        && this.keyKhuVuc !== keyKhuVucKhoangSan.KhuVucDauGia
        && this.keyKhuVuc !== keyKhuVucKhoangSan.KhuVucDuTruKhoangSan
        && this.keyKhuVuc !== keyKhuVucKhoangSan.KhuVucKhoangSanDocHai
        && this.keyKhuVuc !== keyKhuVucKhoangSan.KhuVucKhongDauGia
        ) || this.idKhuVuc == null || this.idKhuVuc === undefined) {
      this.thongTinKhuVucKhoangSan = null;
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucCamTamCam) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucCamTamCamService().getByid(this.idKhuVuc);

      if (this.thongTinKhuVucKhoangSan) {
        if (this.thongTinKhuVucKhoangSan.maloaihinh === MaLoaiHinhEnum.KhuVucCam) {
          this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucCam;
        } else if (this.thongTinKhuVucKhoangSan.maloaihinh === MaLoaiHinhEnum.KhuVucTamCam) {
          this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucTamCam;
        }
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucDauGia) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucDauGiaService().getByid(this.idKhuVuc);

      if (this.thongTinKhuVucKhoangSan) {
        this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucDauGia;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucKhongDauGia) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucKhongDauGiaService().getByid(this.idKhuVuc);

      if (this.thongTinKhuVucKhoangSan) {
        this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucKhongDauGia;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucKhoangSanDocHai) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucKhoangSanDocHaiService().getByid(this.idKhuVuc);

      if (this.thongTinKhuVucKhoangSan) {
        this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucKhoangSanDocHai;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucDuTruKhoangSan) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucDuTruKhoangSanService().getByid(this.idKhuVuc);

      if (this.thongTinKhuVucKhoangSan) {
        this.loaikhuvuc = KhuVucKhoangSanEnum.KhuVucDuTruKhoangSan;
      }
    }
  }
  /**
   * Hàm lấy dữ liệu Tọa độ
   */
  async getAllToaDo() {
    const listData: any = await this.kvKhoangSanFacadeSv
      .getKhuVucToaDoService()
      .getFetchAll({idKhuvuc: this.idKhuVuc});
    if (listData) {
      listData.map((khuvuctoado, index) => {
        khuvuctoado.serialNumber = index + 1;
      });
    }
    this.listToaDo = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemKhuVucToaDo(id: any) {
    // Lấy dữ liệu khu vực tọa độ theo id
    if (this.thongTinKhuVucKhoangSan !== null) {
      const dataItem: any = this.listToaDo.find(item => item.idkhuvuctoado === id);
      await this.matSidenavService.setTitle( this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.titleEdit );
      await this.matSidenavService.setContentComp( KhuvuctoadoIoComponent, "edit", dataItem);
      await this.matSidenavService.open();
    } else {
      this.commonService.showeNotiResult(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.thongtinkhoangsankhongtontaiInform, 2000);
    }
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  openKhuVucToaDoIOSidenav() {
    if (this.thongTinKhuVucKhoangSan !== null) {
      const dataItem: any = {idkhuvuc: this.thongTinKhuVucKhoangSan.idkhuvuc, loaikhuvuc: this.loaikhuvuc};
      this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.titleAdd);
      this.matSidenavService.setContentComp(KhuvuctoadoIoComponent, "new", dataItem);
      this.matSidenavService.open();
    } else {
      this.commonService.showeNotiResult(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.thongtinkhoangsankhongtontaiInform, 2000);
    }
  }

  /**
   * Insert hoặc update dữ liệu vào grid
   */
  addOrUpdateGrid(input: any) {
    if (input.purpose === 'new') {
      this.listToaDo.unshift(input.data);
      this.gridToaDo.refresh();
      this.commonService.showeNotiResult(this.dataTranslate.COMMON.default.successDelete, 2000);
    } else if (input.purpose === 'edit') {

    }
  }

  /**
   * Hàm đóng sidenav
   */
  public closeKhuVucToaDoIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemKhuVucToaDo(data) {
    this.selectedItem = data;
    // const canDelete: string = this.dmFacadeService
    //   .getDmCanhanService()
    //   .checkBeDeleted(this.selectedItem.idcanhan);
    // this.canBeDeletedCheck(canDelete);
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
    // const dialogRef = this.commonService.confirmDeleteDiaLogService(
    //   this.dataTranslate.DANHMUC.canhan.contentDelete,
    //   this.selectedItem.hovaten
    // );
    // dialogRef.afterClosed().subscribe(async (result) => {
    //   if (result === "confirm") {
    //         await this.dmFacadeService
    //           .getDmCanhanService()
    //           .deleteItem({ idCanhan: this.selectedItem.idcanhan })
    //           .subscribe(
    //             () => this.getAllToaDo(),
    //             (error: HttpErrorResponse) => {
    //               this.commonService.showeNotiResult(error.message, 2000);
    //             },
    //             () =>
    //               this.commonService.showeNotiResult(
    //                 this.dataTranslate.COMMON.default.successDelete,
    //                 2000
    //               )
    //           );
    //   }
    // });
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
