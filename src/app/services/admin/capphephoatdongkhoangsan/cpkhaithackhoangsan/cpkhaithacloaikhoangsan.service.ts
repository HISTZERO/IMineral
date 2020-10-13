import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpKhaiThacLoaiKhoangSanModel, OutputCpKhaiThacLoaiKhoangSanModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacloaikhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithacloaikhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacLoaiKhoangSanModel(),
      outputModelName: new OutputCpKhaiThacLoaiKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACLOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Hàm lấy dữ liệu cấp phép khai thác loại khoáng sản theo idcapphepkhaithac
  public getCpKhaiThacLoaiKhoangSanByIdCapPhep(idcapphepkhaithac: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACLOAIKHOANGSAN + "/getbyidcapphepkhaithac"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepkhaithac=${idcapphepkhaithac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
