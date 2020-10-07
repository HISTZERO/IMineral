import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CpThamDoKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.service';
import { CpThamDoDvhcService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdodvhc.service';

@Injectable({
  providedIn: "root",
})

export class CapPhepHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Đăng ký thăm dò service
  public getCapPhepThamDoKhoangSanService() {
    return new CpThamDoKhoangSanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getCapPhepThamDoDvhcService() {
    return new CpThamDoDvhcService(this.httpClient);
  }
}
