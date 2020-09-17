import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ThietlaphethongService } from "src/app/services/admin/thietlap/thietlaphethong.service";
import { CauhinhtailieuService } from "./cauhinhtailieu.service";
import { CoquantiepnhanService } from "./coquantiepnhan.service";

@Injectable({
  providedIn: 'root'
})
export class ThietlapFacadeService {

  constructor(private httpClient: HttpClient) { }

  // Thiết lập hệ thống service
  public getThietLapHeThongService() {
    return new ThietlaphethongService(this.httpClient);
  }

  // Cấu hình tài liệu service
  public getCauHinhTaiLieuService() {
    return new CauhinhtailieuService(this.httpClient);
  }

  // Cơ quan tiếp nhận service
  public getCoQuanTiepNhanService() {
    return new CoquantiepnhanService(this.httpClient);
  }
}
