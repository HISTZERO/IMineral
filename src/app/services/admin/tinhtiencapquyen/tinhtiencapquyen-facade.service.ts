import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TinhTienCapQuyenService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen.service';
import { TinhTienCapQuyenTheoNamService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyentheonam.service';


@Injectable({
  providedIn: "root",
})

export class TinhTienCapQuyenFacadeService {
  constructor(private httpClient: HttpClient) { }

  // tính tiền cấp quyền service
  public getTinhTienCapQuyenKhaiThacKhoangSanService() {
    return new TinhTienCapQuyenService(this.httpClient);
  }

  // chi tiết tính tiền cấp quyền service
  public getChiTietTinhTienTheoNamService() {
    return new TinhTienCapQuyenTheoNamService(this.httpClient);
  }
}
