import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { DiemMoService } from "src/app/services/admin/diemquang-moquang/diemo.service";


@Injectable({
  providedIn: "root",
})

export class DiemQuangMoQuangFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Diểm mỏ service
  public getDiemMoService() {
    return new DiemMoService(this.httpClient);
  }
}
