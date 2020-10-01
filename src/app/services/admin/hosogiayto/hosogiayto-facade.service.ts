import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GiayPhepTaiLieuSerVice } from 'src/app/services/admin/hosogiayto/giaypheptailieu.service';

@Injectable({
  providedIn: "root",
})

export class HoSoGiayToFacadeService {
  constructor(private httpClient: HttpClient) { }

   // Hồ sơ service
   public getGiayPhepTaiLieuService() {
    return new GiayPhepTaiLieuSerVice(this.httpClient);
  }
}
