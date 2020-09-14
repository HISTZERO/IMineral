import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";
import { TaiLieuSerVice } from 'src/app/services/admin/dangkyhoatdongkhoangsan/tailieu.service';


@Injectable({
  providedIn: "root",
})

export class DangKyHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Diểm mỏ service
  public getHoSoService() {
    return new HosoService(this.httpClient);
  }

  // Diểm mỏ service
  public getTaiLieuService() {
    return new TaiLieuSerVice(this.httpClient);
  }
}
