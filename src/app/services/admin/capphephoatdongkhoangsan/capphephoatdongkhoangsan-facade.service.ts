import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CpThamDoKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.service';
import { CpThamDoDvhcService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdodvhc.service';
import { CpThamDoLoaiKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdoloaikhoangsan.service';

@Injectable({
  providedIn: "root",
})

export class CapPhepHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Cấp phép  thăm dò service
  public getCapPhepThamDoKhoangSanService() {
    return new CpThamDoKhoangSanService(this.httpClient);
  }

  // cấp phép thăm dò đơn vị hành chính service
  public getCapPhepThamDoDvhcService() {
    return new CpThamDoDvhcService(this.httpClient);
  }

  // cấp phép thăm dò loại khoáng sản service
  public getCapPhepThamDoLoaiKhoangSanService() {
    return new CpThamDoLoaiKhoangSanService(this.httpClient);
  }
}
