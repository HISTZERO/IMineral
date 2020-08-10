import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { ThietlaphethongService } from "src/app/services/admin/thietlap/thietlaphethong.service";
import { ObjTypeService } from "src/app/services/admin/thietlap/obj-type.service";
import { OtypeOptService } from "src/app/services/admin/thietlap/otype-opt.service";

@Injectable({
  providedIn: 'root'
})
export class ThietlapFacadeService {

  constructor(private httpClient: HttpClient) { }

  public getThietLapHeThongService() {
    return new ThietlaphethongService(this.httpClient);
  }

  public getObjTypeService() {
    return new ObjTypeService(this.httpClient);
  }

  public getOtypeOptService() {
    return new OtypeOptService(this.httpClient);
  }
}
