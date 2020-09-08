import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { BaocaoService } from "src/app/services/admin/baocao/baocao.service";
import { TailieudinhkemService } from "src/app/services/admin/baocao/tailieudinhkem.service";

@Injectable({
  providedIn: 'root'
})
export class BaocaoFacadeService {

  constructor(private httpClient: HttpClient) { }

  // Báo cáo service
  public getBaoCaoService() {
    return new BaocaoService(this.httpClient);
  }

  // Tailieeuj đính kèm service
  public getTaiLieuDinhKemService(){
    return new TailieudinhkemService(this.httpClient);
  }

}
