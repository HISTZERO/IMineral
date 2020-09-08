import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { HosoService } from "src/app/services/admin/dangkyhoatdongkhoangsan/hoso.service";


@Injectable({
  providedIn: "root",
})

export class DangKyHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Diểm mỏ service
  public getHoSoService() {
    return new HosoService(this.httpClient);
  }
}
