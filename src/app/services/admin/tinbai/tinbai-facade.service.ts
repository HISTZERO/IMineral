import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TbChudeService } from "src/app/services/admin/tinbai/chude.service";
import { TbTintucService } from "src/app/services/admin/tinbai/tintuc.service";

@Injectable({
  providedIn: "root",
})
export class TinbaiFacadeService {
  constructor(private httpClient: HttpClient) {}

  // chủ đề service
  public getTbChudeService() {
    return new TbChudeService(this.httpClient);
  }

  // tin tức service
  public getTbTintucService() {
    return new TbTintucService(this.httpClient);
  }
}
