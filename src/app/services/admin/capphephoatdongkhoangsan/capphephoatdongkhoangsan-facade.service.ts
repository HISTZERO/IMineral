import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { CpThamDoKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.service';
import { CpThamDoDvhcService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdodvhc.service';
import { CpThamDoLoaiKhoangSanService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdoloaikhoangsan.service';
import { CpThamDoCongTrinhService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdocongtrinh.service';
import { CpthamdokhuvucService } from 'src/app/services/admin/capphephoatdongkhoangsan/cpthamdokhuvuc.service';
import { CpkhaithackhoangsanService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan.service";
import { CpkhaithacdvhcService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacdvhc.service";
import { CpkhaithaccongtrinhService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithaccongtrinh.service";
import { CpkhaithackhuvucService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhuvuc.service";
import { CpkhaithacloaikhoangsanService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacloaikhoangsan.service";
import { CpkhaithacthietbiService } from "src/app/services/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacthietbi.service";
import {CpTanThuKhoangSanService} from "src/app/services/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan.service";

@Injectable({
  providedIn: "root",
})

export class CapPhepHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) { }

  // Cấp phép  thăm dò service
  public getCapPhepThamDoKhoangSanService() {
    return new CpThamDoKhoangSanService(this.httpClient);
  }

  // cấp phép thăm dò đơn vị hành chính service
  public getCapPhepThamDoDvhcService() {
    return new CpThamDoDvhcService(this.httpClient);
  }

  // cấp phép thăm dò loại khoáng sản service
  public getCapPhepThamDoLoaiKhoangSanService() {
    return new CpThamDoLoaiKhoangSanService(this.httpClient);
  }

  // cấp phép thăm dò công trình service
  public getCapPhepThamDoCongTrinhService() {
    return new CpThamDoCongTrinhService(this.httpClient);
  }

  // cấp phép thăm dò khu vực service
  public getCapPhepThamDoKhuVucService() {
    return new CpthamdokhuvucService(this.httpClient);
  }

  // Cấp phép khai thác khoáng sản service
  public getCapPhepKhaiThacKhoangSanService() {
    return new CpkhaithackhoangsanService(this.httpClient);
  }

  // Cấp phép khai thác đvhc service
  public getCapPhepKhaiThacDVHCService() {
    return new CpkhaithacdvhcService(this.httpClient);
  }

  // Cấp phép khai thác công trình service
  public getCapPhepKhaiThacCongTrinhService() {
    return new CpkhaithaccongtrinhService(this.httpClient);
  }

  // Cấp phép khai thác khu vực service
  public getCapPhepKhaiThacKhuVucService() {
    return new CpkhaithackhuvucService(this.httpClient);
  }

  // Cấp phép khai thác loại khoáng sản service
  public getCapPhepKhaiThacLoaiKhoangSanService() {
    return new CpkhaithacloaikhoangsanService(this.httpClient);
  }

  // Cấp phép khai thác thiết bị service
  public getCapPhepKhaiThacThietBiService() {
    return new CpkhaithacthietbiService(this.httpClient);
  }

  // Cấp phép  tận thu service
  public getCapPhepTanThuKhoangSanService() {
    return new CpTanThuKhoangSanService(this.httpClient);
  }

}
