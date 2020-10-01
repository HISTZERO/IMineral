import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";
import { TaiLieuSerVice } from 'src/app/services/admin/dangkyhoatdongkhoangsan/tailieu.service';
import { DkThamDoKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.service';
import { DkThamDoGiaHanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdogiahan.service';
import { DkThamDoDvhcService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.service';
import { DkThamDoLoaiKhoangSanService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdoloaikhoangsan.service';
import { DkThamDoCongTrinhService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdocongtrinh.service';
import { DkkhaithaccatsoiService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithaccatsoi.service";
import { DkkhaithacdieuchinhService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithacdieuchinh.service";
import { DkkhaithacgiahanService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithacgiahan.service";
import { DkkhaithackhoangsanService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsan.service";
import { DkkhaithackhoangsanduanService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsanduan.service";
import { DkkhaithacvlxdService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithacvlxd.service";
import { DkthamdokhuvucService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdokhuvuc.service";
import {DkKhaiThacDvhcService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithacdvhc.service";
import {DkkhaithacloaikhoangsanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithacloaikhoangsan.service";
import {DkKhaiThacCongTrinhService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dkkhaithaccongtrinh.service";
import { DkthamdotoadokhuvucService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dkthamdotoadokhuvuc.service";


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

  // Đăng ký thăm dò khu vực service
  public getDangKyThamDoKhuVucService() {
    return new DkthamdokhuvucService(this.httpClient);
  }

  // Đăng ký khai thác dvhc service
  public getDangKyKhaiThacDvhcService() {
    return new DkKhaiThacDvhcService(this.httpClient);
  }
  // Đăng ký khai thác service
  public getDangKyKhaiThacLoaiKhoangSanService() {
    return new DkkhaithacloaikhoangsanService(this.httpClient);
  }
  // Đăng ký thăm dò service
  public getDangKyKhaiThacCongTrinhService() {
    return new DkKhaiThacCongTrinhService(this.httpClient);
  }
  
  // Đăng ký thăm dò tọa độ khu vực service
  public getDangKyThamDoToaDoKhuVucService() {
    return new DkthamdotoadokhuvucService(this.httpClient);

  }
}

