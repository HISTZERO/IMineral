import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { DmCanhanService } from "src/app/services/admin/danhmuc/canhan.service";
import { ProvinceService } from "src/app/services/admin/common/province.service";
import { DistrictService } from "src/app/services/admin/common/district.service";
import { WardService } from "src/app/services/admin/common/ward.service";
import { DvhcService } from "src/app/services/admin/common/dvhc.service";
import { CapquanlyService } from "src/app/services/admin/danhmuc/capquanly.service";
import { CaptainguyenService } from "src/app/services/admin/danhmuc/captainguyen.service";
import { CaptruluongService } from "src/app/services/admin/danhmuc/captruluong.service";
import { CoquanquanlyService } from "src/app/services/admin/danhmuc/coquanquanly.service";
import { LoaibaocaoService } from "src/app/services/admin/danhmuc/loaibaocao.service";
import { NhomkhoangsanService } from "src/app/services/admin/danhmuc/nhomkhoangsan.service";
import { LoaikhoangsanService } from "src/app/services/admin/danhmuc/loaikhoangsan.service";
import { LoaitailieuService } from "src/app/services/admin/danhmuc/loaitailieu.service";
import { LoaitochucService } from "src/app/services/admin/danhmuc/loaitochuc.service";
import { NguongocmoService } from "src/app/services/admin/danhmuc/nguongocmo.service";
import { ThutuchanhchinhService } from "src/app/services/admin/danhmuc/thutuchanhchinh.service";
import { TochucService } from "src/app/services/admin/danhmuc/tochuc.service";
import { LoaicapphepService } from "./loaicapphep.service";
import { LoaigiayphepService } from "./loaigiayphep.service";

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
  public getAllDvhcService() {
    return new DvhcService(this.httpClient);
  }

  // ward service
  public getWardService() {
    return new WardService(this.httpClient);
  }

  // Cấp quản lý Service
  public getCapQuanLyService() {
    return new CapquanlyService(this.httpClient);
  }

  // Cấp tài nguyên Service
  public getCapTaiNguyenService() {
    return new CaptainguyenService(this.httpClient);
  }

  // Cấp trữ lượng Service
  public getCapTruLuongService() {
    return new CaptruluongService(this.httpClient);
  }

  // Cơ quan quản lý Service
  public getCoQuanQuanLyService() {
    return new CoquanquanlyService(this.httpClient);
  }

  // Loại báo cáo service
  public getLoaiBaoCaoService() {
    return new LoaibaocaoService(this.httpClient);
  }

  // Nhóm khoáng sản Service
  public getNhomKhoangSanService() {
    return new NhomkhoangsanService(this.httpClient);
  }

  // Loại khoáng sản Service
  public getLoaiKhoangSanService() {
    return new LoaikhoangsanService(this.httpClient);
  }

  // Loại tài liệu Service
  public getLoaiTaiLieuService() {
    return new LoaitailieuService(this.httpClient);
  }

  // Loại tổ chức Service
  public getLoaiToChucService() {
    return new LoaitochucService(this.httpClient);
  }

  // Nguồn gốc mỏ Service
  public getNguonGocMoService() {
    return new NguongocmoService(this.httpClient);
  }

  // Thủ tục hành chính Service
  public getThuTucHanhChinhService() {
    return new ThutuchanhchinhService(this.httpClient);
  }

  // Tổ chức Service
  public getToChucService() {
    return new TochucService(this.httpClient);
  }

  // Loại cấp phép Service
  public getLoaiCapPhepService() {
    return new LoaicapphepService(this.httpClient);
  }

  // Loại giấy phép Service
  public getLoaiGiayPhepService() {
    return new LoaigiayphepService(this.httpClient);
  }
}
