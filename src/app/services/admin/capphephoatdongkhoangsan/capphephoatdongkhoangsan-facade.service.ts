import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CpThamDoKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.service';

@Injectable({
  providedIn: "root",
})

export class CapPhepHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

   // Đăng ký thăm dò service
   public getCapPhepThamDoKhoangSanService() {
    return new CpThamDoKhoangSanService(this.httpClient);
  }
}
