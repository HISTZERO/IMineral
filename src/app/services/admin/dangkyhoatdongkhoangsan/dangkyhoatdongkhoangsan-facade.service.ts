import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";
import { TaiLieuSerVice } from 'src/app/services/admin/dangkyhoatdongkhoangsan/tailieu.service';
import { DkThamDoKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.service';
import { DkThamDoGiaHanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdogiahan.service';


@Injectable({
  providedIn: "root",
})

export class DangKyHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Hồ sơ service
  public getHoSoService() {
    return new HosoService(this.httpClient);
  }

  // Tài liệu service
  public getTaiLieuService() {
    return new TaiLieuSerVice(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoService() {
    return new DkThamDoKhoangSanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoGiaHanService() {
    return new DkThamDoGiaHanService(this.httpClient);
  }
}
