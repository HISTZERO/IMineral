import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { DmCanhanService } from "src/app/services/admin/danhmuc/canhan.service";
import { ProvinceService } from "src/app/services/admin/common/province.service";
import { DistrictService } from "src/app/services/admin/common/district.service";
import { WardService } from "src/app/services/admin/common/ward.service";
import { DmDvhcService } from "src/app/services/admin/common/dvhc.service";
import { DmCapquanlyService } from "src/app/services/admin/danhmuc/capquanly.service";
import { DmCaptainguyenService } from "src/app/services/admin/danhmuc/captainguyen.service";
import { DmCaptruluongService } from "src/app/services/admin/danhmuc/captruluong.service";
import { DmCoquanquanlyService } from "src/app/services/admin/danhmuc/coquanquanly.service";
import { DmLoaibaocaoService } from "src/app/services/admin/danhmuc/loaibaocao.service";
import { DmNhomkhoangsanService } from "src/app/services/admin/danhmuc/nhomkhoangsan.service";
import { DmLoaikhoangsanService } from "src/app/services/admin/danhmuc/loaikhoangsan.service";
import { DmLoaitailieuService } from "src/app/services/admin/danhmuc/loaitailieu.service";
import { DmLoaitochucService } from "src/app/services/admin/danhmuc/loaitochuc.service";
import { DmNguongocmoService } from "src/app/services/admin/danhmuc/nguongocmo.service";
import { DmThutuchanhchinhService } from "src/app/services/admin/danhmuc/thutuchanhchinh.service";
import { DmTochucService } from "src/app/services/admin/danhmuc/tochuc.service";
import { DmLoaicapphepService } from "src/app/services/admin/danhmuc/loaicapphep.service";
import { DmLoaigiayphepService } from "src/app/services/admin/danhmuc/loaigiayphep.service";
import { DmLinhvucService } from "src/app/services/admin/danhmuc/linhvuc.service";

@Injectable({
  providedIn: "root",
})

export class DmFacadeService {
  constructor(private httpClient: HttpClient) {}

  // cá nhân service
  public getDmCanhanService() {
    return new DmCanhanService(this.httpClient);
  }

  // province service
  public getProvinceService() {
    return new ProvinceService(this.httpClient);
  }

  // district service
  public getDistrictService() {
    return new DistrictService(this.httpClient);
  }

  // get all dvhc service
  public getAllDmDvhcService() {
    return new DmDvhcService(this.httpClient);
  }

  // ward service
  public getWardService() {
    return new WardService(this.httpClient);
  }

  // Cấp quản lý Service
  public getDmCapQuanLyService() {
    return new DmCapquanlyService(this.httpClient);
  }

  // Cấp tài nguyên Service
  public getDmCapTaiNguyenService() {
    return new DmCaptainguyenService(this.httpClient);
  }

  // Cấp trữ lượng Service
  public getDmCapTruLuongService() {
    return new DmCaptruluongService(this.httpClient);
  }

  // Cơ quan quản lý Service
  public getDmCoQuanQuanLyService() {
    return new DmCoquanquanlyService(this.httpClient);
  }

  // Loại báo cáo service
  public getDmLoaiBaoCaoService() {
    return new DmLoaibaocaoService(this.httpClient);
  }

  // Nhóm khoáng sản Service
  public getDmNhomKhoangSanService() {
    return new DmNhomkhoangsanService(this.httpClient);
  }

  // Loại khoáng sản Service
  public getDmLoaiKhoangSanService() {
    return new DmLoaikhoangsanService(this.httpClient);
  }

  // Loại tài liệu Service
  public getDmLoaiTaiLieuService() {
    return new DmLoaitailieuService(this.httpClient);
  }

  // Loại tổ chức Service
  public getDmLoaiToChucService() {
    return new DmLoaitochucService(this.httpClient);
  }

  // Nguồn gốc mỏ Service
  public getDmNguonGocMoService() {
    return new DmNguongocmoService(this.httpClient);
  }

  // Thủ tục hành chính Service
  public getDmThuTucHanhChinhService() {
    return new DmThutuchanhchinhService(this.httpClient);
  }

  // Tổ chức Service
  public getDmToChucService() {
    return new DmTochucService(this.httpClient);
  }

  // Loại cấp phép Service
  public getDmLoaiCapPhepService() {
    return new DmLoaicapphepService(this.httpClient);
  }

  // Loại giấy phép Service
  public getDmLoaiGiayPhepService() {
    return new DmLoaigiayphepService(this.httpClient);
  }

  // lĩnh vực service
  public getDmLinhvucService() {
    return new DmLinhvucService(this.httpClient);
  }
}
