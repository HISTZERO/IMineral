import { Component, OnInit } from '@angular/core';
import { CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-cp-pdtlks-thongtinquyetdinh',
  templateUrl: './cp-pdtlks-thongtinquyetdinh.component.html',
  styleUrls: ['./cp-pdtlks-thongtinquyetdinh.component.scss']
})
export class CpPdtlksThongtinquyetdinhComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // Lưu trữ thông tin đăng ký tab
public TabType = CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum;
// public loadedTabState: any = {
//   [this.TabType.ThongTinGiayPhep]: true,
//   [this.TabType.TaiLieuGiayPhepDinhKem]: false,
//   [this.TabType.ThongTinCapPhep]: false
// };

public disabledTabState: any = {
  [this.TabType.ThongTinChiTiet]: false,
  [this.TabType.LoaiKhoangSan]: true,
  [this.TabType.TruLuongKhuVuc]: true,
  [this.TabType.KhoiLuongTruLuong]: true

};
async tabChange(index: any) {}
}
