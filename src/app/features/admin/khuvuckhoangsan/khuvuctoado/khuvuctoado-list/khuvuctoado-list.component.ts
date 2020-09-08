import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, Input} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { KhuvuctoadoIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuctoado/khuvuctoado-io/khuvuctoado-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import {KhuVucKhoangSanEnum, MaLoaiHinhEnum, keyKhuVucKhoangSan, KhuVucKhoangSan} from "src/app/shared/constants/khuvuckhoangsan-constants";
import { OutputKhuVucToaDoModel } from 'src/app/models/admin/khuvuckhoangsan/khuvuctoado.model';
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import { SequenceModel } from 'src/app/models/admin/common/sequence.model';

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

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

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

  public loaiKhuVuc: number;

  public loaiKhuVucKhoangSan = KhuVucKhoangSan;

  public minimumNumberOfKhuVucToaDoRecord = 3;

  private squencekhuVucToaDoId: SequenceModel = new SequenceModel();

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
    public generalClientService: GeneralClientService
  ) { }

  async ngOnInit() {
    if (this.allowAutoInit) {
      await this.manualInit();
    }
  }

  async manualInit() {
    this.squencekhuVucToaDoId.setDefaultValue(1);

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

    return true;
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
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucCamTamCamService().getByid(this.idKhuVuc).toPromise();

      if (this.thongTinKhuVucKhoangSan) {
        if (this.thongTinKhuVucKhoangSan.maloaihinh === MaLoaiHinhEnum.KhuVucCam) {
          this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucCam;
        } else if (this.thongTinKhuVucKhoangSan.maloaihinh === MaLoaiHinhEnum.KhuVucTamCam) {
          this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucTamCam;
        }
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucDauGia) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucDauGiaService().getByid(this.idKhuVuc).toPromise();

      if (this.thongTinKhuVucKhoangSan) {
        this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucDauGia;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucKhongDauGia) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucKhongDauGiaService().getByid(this.idKhuVuc).toPromise();

      if (this.thongTinKhuVucKhoangSan) {
        this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucKhongDauGia;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucKhoangSanDocHai) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucKhoangSanDocHaiService().getByid(this.idKhuVuc).toPromise();

      if (this.thongTinKhuVucKhoangSan) {
        this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucKhoangSanDocHai;
      }
    } else if (this.keyKhuVuc === keyKhuVucKhoangSan.KhuVucDuTruKhoangSan) {
      this.thongTinKhuVucKhoangSan = await this.kvKhoangSanFacadeSv.getKhuVucDuTruKhoangSanService().getByid(this.idKhuVuc).toPromise();

      if (this.thongTinKhuVucKhoangSan) {
        this.loaiKhuVuc = KhuVucKhoangSanEnum.KhuVucDuTruKhoangSan;
      }
    }
  }
  /**
   * Hàm lấy dữ liệu Tọa độ
   */
  async getAllToaDo() {
    const listData: any = await this.kvKhoangSanFacadeSv
      .getKhuVucToaDoService()
      .getFetchAll({idKhuvuc: this.idKhuVuc}) as OutputKhuVucToaDoModel[];
    this.listToaDo = this.generalClientService.generateOrderOf(listData, "serialNumber", 1);
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
      this.commonService.showDialogWarning(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.thongtinkhoangsankhongtontaiInform);
    }
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  openKhuVucToaDoIOSidenav() {
    if (this.thongTinKhuVucKhoangSan !== null) {
      const dataItem: any = {idkhuvuc: this.thongTinKhuVucKhoangSan.idkhuvuc, loaikhuvuc: this.loaiKhuVuc};
      this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.titleAdd);
      this.matSidenavService.setContentComp(KhuvuctoadoIoComponent, "new", dataItem);
      this.matSidenavService.open();
    } else {
      this.commonService.showDialogWarning(this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.thongtinkhoangsankhongtontaiInform);
    }
  }

  /**
   * Insert hoặc update dữ liệu vào grid
   */
  addOrUpdateGrid(input: any) {
    if (input.purpose === 'new') {
      input.data.idkhuvuctoado = this.squencekhuVucToaDoId.getNextVal();
      this.listToaDo.unshift(input.data);
      this.commonService.showeNotiResult(this.dataTranslate.COMMON.default.successAdd, 2000);
    } else if (input.purpose === 'edit') {
      this.listToaDo = this.generalClientService.updateDataToList<OutputKhuVucToaDoModel>(this.listToaDo, input.data, "idkhuvuctoado");
      this.commonService.showeNotiResult(this.dataTranslate.COMMON.default.successEdit, 2000);
    }

    this.listToaDo = this.generalClientService.generateOrderOf<OutputKhuVucToaDoModel>(this.listToaDo, "serialNumber", 1);
    this.gridToaDo.refresh();
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
    const canDelete: string = this.kvKhoangSanFacadeSv
      .getKhuVucToaDoService()
      .checkBeDeleted(this.selectedItem.idkhuvuctoado);
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
    let content = this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.sohieu + ": " + this.selectedItem.sohieu + ", ";
    content += this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadox + ": " + this.selectedItem.toadox + ", ";
    content += this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadoy + ": " + this.selectedItem.toadoy;
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.contentDelete,
      content
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const index = this.listToaDo.findIndex(d => d.idkhuvuctoado === this.selectedItem.idkhuvuctoado);
        this.listToaDo.splice(index, 1);
        this.listToaDo = this.generalClientService.generateOrderOf<OutputKhuVucToaDoModel>(this.listToaDo, "serialNumber", 1);
        this.gridToaDo.refresh();
        this.commonService.showeNotiResult(
          this.dataTranslate.COMMON.default.successDelete,
          2000
        );
      }
    });
  }

  /* save
   * Save dữ liệu tọa độ theo khu vực
   */
  async saveData() {
    /*
      Kiểm tra dữ liệu tọa độ trên grid.
        - Nếu không tồn tại. Gọi xóa dữ liệu tọa độ trên DB theo idkhuvuc
        - Nếu dữ liệu tọa độ trên Grid ít hơn 3 thì gửi thông báo
        - Nếu dữ liêu trên grid lớn hơn 3 cập nhật dữ liệu vào DB theo idkhuvuc
     */
    const dialogRef = this.commonService.confirmSaveDiaLogService("", "");
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        if ((this.listToaDo === null || this.listToaDo.length === 0) && this.idKhuVuc !== null && this.idKhuVuc !== undefined) {
          await this.kvKhoangSanFacadeSv.getKhuVucToaDoService()
              .deleteItem({idkhuvuc: this.idKhuVuc})
              .subscribe(
                () => this.getAllToaDo(),
                (error: HttpErrorResponse) => {
                  this.commonService.showDialogWarning(error.error.errors);
                },
                () =>
                  this.commonService.showeNotiResult(
                    this.dataTranslate.COMMON.default.successDelete,
                    2000
                  )
              );
        } else {
          if (this.listToaDo.length < this.minimumNumberOfKhuVucToaDoRecord) {
            const informationDialogRef = this.commonService.informationDiaLogService(
              "",
              this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.thongtinkiemtrasoluongkhuvuctoado,
              this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.informedDialogTitle,
            );
          } else {
            await this.kvKhoangSanFacadeSv.getKhuVucToaDoService()
              .updateItem({list: this.listToaDo})
              .subscribe(
                () => this.getAllToaDo(),
                (error: HttpErrorResponse) => {
                  this.commonService.showDialogWarning(error.error.errors);
                },
                () =>
                  this.commonService.showeNotiResult(
                    this.dataTranslate.COMMON.default.successSave,
                    2000
                  )
              );
          }
        }
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
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

}
