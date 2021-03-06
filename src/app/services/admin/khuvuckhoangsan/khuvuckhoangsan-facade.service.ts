import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { KhuVucDauGiaService } from "src/app/services/admin/khuvuckhoangsan/khuvucdaugia.service";
import { KhuVucKhongDauGiaService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhongdaugia.service";
import { KhuvuccamTamcamService } from "src/app/services/admin/khuvuckhoangsan/khuvuccam-tamcam.service";
import { KhuvuckhoangsandochaiService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsandochai.service";
import { KhuvucdutrukhoangsanService } from "src/app/services/admin/khuvuckhoangsan/khuvucdutrukhoangsan.service";
import { KhuvuctoadoService } from "src/app/services/admin/khuvuckhoangsan/khuvuctoado.service";

@Injectable({
  providedIn: "root",
})

export class KhuVucKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Khu vực đấu giá service
  public getKhuVucDauGiaService() {
    return new KhuVucDauGiaService(this.httpClient);
  }

  // Khu vực đấu giá service
  public getKhuVucKhongDauGiaService() {
    return new KhuVucKhongDauGiaService(this.httpClient);
  }

  // Khu vực cấm tạm cấm
  public getKhuVucCamTamCamService() {
    return new KhuvuccamTamcamService(this.httpClient);
  }

  // Khu vực khoáng sản độc hại
  public getKhuVucKhoangSanDocHaiService() {
    return new KhuvuckhoangsandochaiService(this.httpClient);
  }

  // Khu vực dữ trữ khoáng sản 
  public getKhuVucDuTruKhoangSanService() {
    return new KhuvucdutrukhoangsanService(this.httpClient);
  }

  // Khu vực tọa độ
  public getKhuVucToaDoService() {
    return new KhuvuctoadoService(this.httpClient);
  }
}
