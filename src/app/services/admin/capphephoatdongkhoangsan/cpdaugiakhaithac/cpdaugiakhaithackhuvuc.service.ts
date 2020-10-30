import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {
  InputCpDauGiaKhuVucModel,
  OutputCpDauGiaKhuVucModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiakhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class CpdaugiakhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpDauGiaKhuVucModel(),
      outputModelName: new OutputCpDauGiaKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHUVUC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  /**
   * Hàm lấy dữ liệu cấp phép khai thác khu vực theo idcapphepkhaithac
   */
  public getCpDauGiaKhuVucByIdCapPhep(idcapphepdaugia: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHUVUC
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepdaugia=${idcapphepdaugia}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
  //
  // /**
  //  * Hàm thêm mới item cấp phép khai thác khu vực
  //  */
  // public insertCapPhepKhaiThacKhuVuc(dataBody: any) {
  //   try {
  //     this.setServiceInfo({
  //       apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHUVUC
  //     });
  //
  //     return this.addItem(dataBody);
  //   } catch (error) {
  //
  //   }
  // }
  //
  // /**
  //  * Hàm update item cấp phép khai thác khu vực
  //  */
  // public updateCapPhepKhaiThacKhuVuc(dataBody: any) {
  //   try {
  //     this.setServiceInfo({
  //       apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHUVUC
  //     });
  //
  //     return this.updateItem(dataBody);
  //   } catch (error) {
  //
  //   }
  // }
}
