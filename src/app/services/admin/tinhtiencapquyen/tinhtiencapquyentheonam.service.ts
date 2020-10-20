import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputTtTinhTienTheoNamModel, OutputTtTinhTienTheoNamModel } from 'src/app/models/admin/tinhtiencapquyen/tttientheonam.model';

@Injectable({
  providedIn: 'root'
})
export class TinhTienCapQuyenTheoNamService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputTtTinhTienTheoNamModel(),
      outputModelName: new OutputTtTinhTienTheoNamModel(),
      apiUrl: environment.apiIMineral + ServiceName.TTTIENTHEONAM
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getChiTietTinhTienTheoNamByIdTinhTienCapQuyen(idtTinhTienCapQuyen: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getalltientheonambyidcapquyen?idtinhtiencapquyen=${idtTinhTienCapQuyen}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
