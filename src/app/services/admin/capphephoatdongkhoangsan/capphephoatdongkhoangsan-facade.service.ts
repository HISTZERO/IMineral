import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GiayPhepService } from 'src/app/services/admin/capphephoatdongkhoangsan/giayphep.service';

@Injectable({
  providedIn: "root",
})

export class CapPhepHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

//  // Giấy phép service
//  public getGiayPhepService() {
//   return new GiayPhepService(this.httpClient);
// }
}
