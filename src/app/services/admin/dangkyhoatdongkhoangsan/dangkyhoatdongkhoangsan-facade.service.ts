import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";
import { TaiLieuSerVice } from 'src/app/services/admin/dangkyhoatdongkhoangsan/tailieu.service';
import { DkThamDoKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.service';
import { DkThamDoGiaHanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdogiahan.service';
import { DkThamDoDvhcService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.service';
import { DkThamDoLoaiKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdoloaikhoangsan.service';
import { DkThamDoCongTrinhService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdocongtrinh.service';
import { DkkhaithaccatsoiService } from "./dkkhaithaccatsoi.service";
import { DkkhaithacdieuchinhService } from "./dkkhaithacdieuchinh.service";
import { DkkhaithacgiahanService } from "./dkkhaithacgiahan.service";
import { DkkhaithackhoangsanService } from "./dkkhaithackhoangsan.service";
import { DkkhaithackhoangsanduanService } from "./dkkhaithackhoangsanduan.service";
import { DkkhaithacvlxdService } from "./dkkhaithacvlxd.service";


@Injectable({
  providedIn: "root",
})

export class DangKyHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

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

  // Đăng ký khai thác cát sỏi service
  public getDangKyKhaiThacCatSoiService() {
    return new DkkhaithaccatsoiService(this.httpClient);
  }

  // Đăng ký khai thác điều chỉnh service
  public getDangKyKhaiThacDieuChinhService() {
    return new DkkhaithacdieuchinhService(this.httpClient);
  }

  // Đăng ký khai thác gia hạn service
  public getDangKyKhaiThacGiaHanService() {
    return new DkkhaithacgiahanService(this.httpClient);
  }

  // Đăng ký khai thác khoáng sản service
  public getDangKyKhaiThacKhoangSanService() {
    return new DkkhaithackhoangsanService(this.httpClient);
  }

  // Đăng ký khai thác khoáng sản dự án service
  public getDangKyKhaiThacKhoangSanDuAnService() {
    return new DkkhaithackhoangsanduanService(this.httpClient);
  }

  // Đăng ký khai thác vật liệu xây dựng service
  public getDangkyKhaiThacVLXDService() {
    return new DkkhaithacvlxdService(this.httpClient);
  }
}

