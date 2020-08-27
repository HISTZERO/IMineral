import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { KhuVucDauGiaService } from "src/app/services/admin/khuvuckhoangsan/khuvucdaugia.service";

@Injectable({
  providedIn: "root",
})

export class KhuVucKhoangSangFacadeService {
  constructor(private httpClient: HttpClient) {}

  // cá nhân service
  public getKhuVucDauGiaService() {
    return new KhuVucDauGiaService(this.httpClient);
  }
}
