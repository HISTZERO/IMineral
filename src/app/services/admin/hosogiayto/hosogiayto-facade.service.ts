import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { GiayPhepTaiLieuSerVice } from 'src/app/services/admin/hosogiayto/giaypheptailieu.service';
import { GiayPhepService } from 'src/app/services/admin/hosogiayto/giayphep.service';
import { HosoService } from "src/app/services/admin/hosogiayto/hoso.service";
import { TaiLieuSerVice } from "src/app/services/admin/hosogiayto/tailieu.service";

@Injectable({
  providedIn: "root",
})

export class HoSoGiayToFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Hồ sơ service
  public getHoSoService() {
    return new HosoService(this.httpClient);
  }

  // Tài liệu service
  public getTaiLieuService() {
    return new TaiLieuSerVice(this.httpClient);
  }

  // Giấy phép service
  public getGiayPhepService() {
    return new GiayPhepService(this.httpClient);
  }

  // Giấy phép tài liệu service
  public getGiayPhepTaiLieuService() {
    return new GiayPhepTaiLieuSerVice(this.httpClient);
  }
}
