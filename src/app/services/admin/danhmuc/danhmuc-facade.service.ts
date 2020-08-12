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
import { CoquanquanlyService } from "./coquanquanly.service";

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
}
