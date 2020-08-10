import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionSettingsModel, GridComponent } from "@syncfusion/ej2-angular-grids";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";

@Component({
  selector: 'app-pheduyet-dulieu',
  templateUrl: './pheduyet-dulieu.component.html',
  styleUrls: ['./pheduyet-dulieu.component.css']
})
export class PheduyetDulieuComponent implements OnInit {

  public data: object[];
  @ViewChild('grid', { static: true }) public grid: GridComponent;
  public selectionOptions: SelectionSettingsModel;
  public settingsCommon = new SettingsCommon();
  public pageSize: number;
  constructor(public thietlapFacadeService: ThietlapFacadeService) { }

  ngOnInit() {
    this.getPageSize();
    this.data = [{
      serialNumber: 1,
      ngaydo: "10/10/2020",
      ketqua: 100,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 2,
      ngaydo: "11/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 3,
      ngaydo: "12/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 4,
      ngaydo: "13/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 5,
      ngaydo: "14/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 6,
      ngaydo: "15/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 7,
      ngaydo: "16/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 8,
      ngaydo: "17/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 9,
      ngaydo: "18/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 10,
      ngaydo: "19/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 11,
      ngaydo: "20/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 12,
      ngaydo: "21/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    },
    {
      serialNumber: 13,
      ngaydo: "22/10/2020",
      ketqua: 143,
      status: "Đang chờ duyệt"
    }];
  }

  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.pageSize = +pageSize;
  }

  public clickBtnDuyet() {
    const selectedrecords: object[] = this.grid.getSelectedRecords();  // Get the selected records.
  }
}
