import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HuonggioService } from "./huonggio.service";
import { DmCanhanService } from "./canhan.service";
import { TangchuanuocService } from "./tangchuanuoc.service";
import { TieuchuanService } from "./tieuchuan.service";
import { ThamsoService } from "./thamso.service";
import { TcclService } from "./tccl.service";
import { LoaisolieuService } from "./loaisolieu.service";
import { ProvinceService } from "src/app/services/admin/common/province.service";
import { DistrictService } from "src/app/services/admin/common/district.service";
import { WardService } from "src/app/services/admin/common/ward.service";
import { NhomthamsoService } from "./nhomthamso.service";
import { DuanService } from "./duan.service";
import { DmCongtyService } from "./congty.service";
import { DmCoquantochucService } from "./coquantochuc.service";
import { DonvidoService } from "./donvido.service";
import { DvhcService } from "src/app/services/admin/common/dvhc.service";
import { DmThietbiquantracService } from "./thietbiquantrac.service";

@Injectable({
  providedIn: "root",
})
export class DmFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Thiết bị quan trắc
  public getDmThietbiquantracService() {
    return new DmThietbiquantracService(this.httpClient);
  }

  // Công ty service
  public getDmCongtyService() {
    return new DmCongtyService(this.httpClient);
  }

  // Cơ quan tổ chức service
  public getDmCoquantochucService() {
    return new DmCoquantochucService(this.httpClient);
  }

  // cá nhân service
  public getDmCanhanService() {
    return new DmCanhanService(this.httpClient);
  }

  // nhóm tham số service
  public getNhomthamsoService() {
    return new NhomthamsoService(this.httpClient);
  }

  // tầng chứa nước service
  public getTangchuanuocService() {
    return new TangchuanuocService(this.httpClient);
  }

  // tiêu chuẩn chất lượng service
  public getTieuchuanchatluongService() {
    return new TcclService(this.httpClient);
  }

  // tham số service
  public getThamsoService() {
    return new ThamsoService(this.httpClient);
  }

  // tiêu chuẩn service
  public getTieuchuanService() {
    return new TieuchuanService(this.httpClient);
  }

  // loại số liệu service
  public getLoaisolieuService() {
    return new LoaisolieuService(this.httpClient);
  }

  // dự án service
  public getDuanService() {
    return new DuanService(this.httpClient);
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

  // Donvido service
  public getDonvidoService() {
    return new DonvidoService(this.httpClient);
  }

  // Huonggio service
  public getHuonggioService() {
    return new HuonggioService(this.httpClient);
  }
}
