import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { HethongFacadeService } from "src/app/services/admin/hethong/hethong-facade.service";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-grids";
import { Observable } from "rxjs";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";

@Component({
  selector: 'app-hethong-log',
  templateUrl: './hethong-log.component.html',
  styleUrls: ['./hethong-log.component.scss']
})
export class HethongLogComponent implements OnInit {
  hethongLogForm: FormGroup;

  public settingsCommon = new SettingsCommon();
  public hethongLogService: any;
  public state: DataStateChangeEventArgs;
  public dataLog: Observable<DataStateChangeEventArgs>;
  public loaiCongTrinhFilters: any;
  public allLoaiCongTrinh: any;

  public body = {
    criteria: {
      moduleCode: "VNPT_iMONITORING_MODULE"
    },
    pageNumber: 1,
    pageSize: 20,
    isGetAll: false
  };
  constructor(
    private formBuilder: FormBuilder,
    public cmFacadeService: CommonFacadeService,
    public hethongFacadeService: HethongFacadeService,
    public thietlapFacadeService: ThietlapFacadeService
  ) {
    this.hethongLogService = this.hethongFacadeService.getHeThongLogService();
  }

  ngOnInit() {
    this.formInit();
    this.getAllLoaiCongTrinh();
    this.getAllDataLog();
  }

  // init FormControl
  formInit() {
    this.hethongLogForm = this.formBuilder.group({
      objKey: [""],
      tenCongTrinh: [""],
      dateTime: [""],
      userName: [""]
    });
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.hethongLogService.getDataSearchServer(state, this.body);
  }

  // Hàm show log phân trang
  async getAllDataLog() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.listPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.dataLog = this.hethongLogService;
    this.hethongLogService.getDataSearchServer({
      skip: 0,
      take: this.settingsCommon.pageSettings.pageSize,
    }, this.body);
  }

  // Hiển thị tất cả các loại công trình của hệ thống
  async getAllLoaiCongTrinh() {
    this.allLoaiCongTrinh = await this.cmFacadeService.getObjKeyService().getFetchAll();
    this.loaiCongTrinhFilters = this.allLoaiCongTrinh;
  }
}
