import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TinhTienCapQuyenService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen.service';


@Injectable({
  providedIn: "root",
})

export class TinhTienCapQuyenFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Cấp phép  thăm dò service
  public getTinhTienCapQuyenKhaiThacKhoangSanService() {
    return new TinhTienCapQuyenService(this.httpClient);
  }
}
