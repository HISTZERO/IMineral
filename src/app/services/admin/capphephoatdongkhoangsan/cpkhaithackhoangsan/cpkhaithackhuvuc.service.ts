import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpKhaiThacKhuVucModel, OutputCpKhaiThacKhuVucModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithackhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacKhuVucModel(),
      outputModelName: new OutputCpKhaiThacKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHUVUC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  /**
   * Hàm lấy dữ liệu cấp phép khai thác khu vực theo idcapphepkhaithac
   */
  public getCpKhaiThacKhuVucByIdCapPhep(idcapphepkhaithac: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHUVUC + "/getbyidcapphepkhaithac"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepkhaithac=${idcapphepkhaithac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  /**
   * Hàm thêm mới item cấp phép khai thác khu vực
   */
  public insertCapPhepKhaiThacKhuVuc(dataBody: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHUVUC + "/insertcpkhuvuclisttoado"
      });

      return this.addItem(dataBody);
    } catch (error) {

    }
  }

  /**
   * Hàm update item cấp phép khai thác khu vực
   */
  public updateCapPhepKhaiThacKhuVuc(dataBody: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHUVUC + "/updatecpkhuvuclisttoado"
      });

      return this.updateItem(dataBody);
    } catch (error) {

    }
  }

}
