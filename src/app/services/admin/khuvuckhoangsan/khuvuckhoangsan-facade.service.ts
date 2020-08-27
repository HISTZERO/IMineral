import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { KhuVucDauGiaService } from "src/app/services/admin/khuvuckhoangsan/khuvucdaugia.service";
import { KhuvuccamTamcamService } from "src/app/services/admin/khuvuckhoangsan/khuvuccam-tamcam.service";

@Injectable({
  providedIn: "root",
})

export class KhuVucKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Khu vực đấu giá service
  public getKhuVucDauGiaService() {
    return new KhuVucDauGiaService(this.httpClient);
  }

  // Khu vực cấm tạm cấm
  public getKhuVucCamTamCamService() {
    return new KhuvuccamTamcamService(this.httpClient);
  }
}
