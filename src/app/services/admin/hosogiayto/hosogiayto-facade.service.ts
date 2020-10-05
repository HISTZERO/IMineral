import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GiayPhepTaiLieuSerVice } from 'src/app/services/admin/hosogiayto/giaypheptailieu.service';
import { GiayPhepService } from 'src/app/services/admin/hosogiayto/giayphep.service';

@Injectable({
  providedIn: "root",
})

export class HoSoGiayToFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Giấy phép service
  public getGiayPhepService() {
    return new GiayPhepService(this.httpClient);
  }

  // Giấy phép tài liệu service
  public getGiayPhepTaiLieuService() {
    return new GiayPhepTaiLieuSerVice(this.httpClient);
  }
}
