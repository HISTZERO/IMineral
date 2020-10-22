import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum } from "src/app/shared/constants/enum";

@Component({
  selector: "app-cp-pdtlks-thongtinquyetdinh",
  templateUrl: "./cp-pdtlks-thongtinquyetdinh.component.html",
  styleUrls: ["./cp-pdtlks-thongtinquyetdinh.component.scss"],
})
export class CpPdtlksThongtinquyetdinhComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum;
  public disabledTabState: any = {
    [this.TabType.ThongTinChiTiet]: false,
    [this.TabType.LoaiKhoangSan]: true,
    [this.TabType.TruLuongKhuVuc]: true,
    [this.TabType.KhoiLuongTruLuong]: true,
  };
  ngOnInit() {
  }

  // public loadedTabState: any = {
  //   [this.TabType.ThongTinGiayPhep]: true,
  //   [this.TabType.TaiLieuGiayPhepDinhKem]: false,
  //   [this.TabType.ThongTinCapPhep]: false
  // };

  async tabChange(index: any) {}
}
