import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDkKhaiThacKhuVucModel, OutputDkKhaiThacKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithackhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacKhuVucModel(),
      outputModelName: new OutputDkKhaiThacKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHUVUC
    });
  }

   // Hàm service thêm mới khu vực và tọa độ
   public insertKhuVucVaToaDoKhaiThac(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHUVUC + "/insertdkkhaithackhuvuc",
    });
    return this.addItem(body);
  }

  // hàm service update khu vực và tọa dộ
  public updateKhuVucVaToaDoKhaiThac(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHUVUC + "/updatedkkhaithackhuvuc",
    });
    return this.updateItem(body);
  }
  

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
