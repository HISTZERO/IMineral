import { Component, OnInit } from "@angular/core";
import { DangKyDauGiaKTKSTabEnum } from "src/app/shared/constants/enum";

@Component({
  selector: "app-dgq-thongtindangky",
  templateUrl: "./dgq-thongtindangky.component.html",
  styleUrls: ["./dgq-thongtindangky.component.scss"],
})
export class DgqThongtindangkyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyDauGiaKTKSTabEnum;
  public loadedTabState: any = {
    [this.TabType.ThongTinChiTiet]: true,
    [this.TabType.DonViHanhChinh]: false,
    [this.TabType.LoaiKhoangSan]: false,
    [this.TabType.KhuVucKhaiThac]: false,
    [this.TabType.CongTrinhKhaiThac]: false,
    [this.TabType.ThietBi]: false,
  };

  public disabledTabState: any = {
    [this.TabType.ThongTinChiTiet]: false,
    [this.TabType.DonViHanhChinh]: true,
    [this.TabType.LoaiKhoangSan]: true,
    [this.TabType.KhuVucKhaiThac]: true,
    [this.TabType.CongTrinhKhaiThac]: true,
    [this.TabType.ThietBi]: true,
  };
  async tabChange(index: any) {}
}
