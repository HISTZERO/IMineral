import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";
import { TaiLieuSerVice } from 'src/app/services/admin/dangkyhoatdongkhoangsan/tailieu.service';
import { DkThamDoKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.service';
import { DkThamDoGiaHanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdogiahan.service';
import { DkThamDoDvhcService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.service';
import { DkThamDoLoaiKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdoloaikhoangsan.service';
import { DkThamDoCongTrinhService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdocongtrinh.service';


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
  public getDangKyThamDoKhoangSanService() {
    return new DkThamDoKhoangSanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoGiaHanService() {
    return new DkThamDoGiaHanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoDvhcService() {
    return new DkThamDoDvhcService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoLoaiKhoangSanService() {
    return new DkThamDoLoaiKhoangSanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoCongTrinhService() {
    return new DkThamDoCongTrinhService(this.httpClient);
  }
}

