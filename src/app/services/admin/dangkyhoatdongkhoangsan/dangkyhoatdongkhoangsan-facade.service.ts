import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {DkkhaithaccatsoiService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithaccatsoi.service";
import {DkkhaithacdieuchinhService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacdieuchinh.service";
import {DkkhaithacvlxdService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacvlxd.service";
import {DkKhaiThacDvhcService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacdvhc.service";
import {DkKhaiThacCongTrinhService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithaccongtrinh.service";
import {DkkhaithackhuvucService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithackhuvuc.service";
import {DkkhaithactralaiService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytralaigiayphep/dkkhaithactralai.service";
import {DkthamdotralaiService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytralaigiayphep/dkthamdotralai.service";
import {DktanthutralaiService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytralaigiayphep/dktanthutralai.service";
import {DkdongcuamoService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkydongcuamo/dkdongcuamo.service";
import {DkkhaithacgiahanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacgiahan.service";
import {DkkhaithackhoangsanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithackhoangsan.service";
import {DkkhaithackhoangsanduanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithackhoangsanduan.service";
import {DkkhaithacthietbiService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacthietbi.service";
import {DkkhaithacloaikhoangsanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacloaikhoangsan.service";
import {DkThamDoKhoangSanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdokhoangsan.service";
import {DkThamDoGiaHanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdogiahan.service";
import {DkThamDoDvhcService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdodvhc.service";
import {DkThamDoLoaiKhoangSanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdoloaikhoangsan.service";
import {DkThamDoCongTrinhService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdocongtrinh.service";
import {DkthamdokhuvucService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdokhuvuc.service";
import {DkthamdotoadokhuvucService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdotoadokhuvuc.service";
import {DktanthukhoangsanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhoangsan.service";
import {DktanthugiahanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthugiahan.service";
import {DktanthuloaikhoangsanService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthuloaikhoangsan.service";
import {DktanthukhuvucService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhuvuc.service";
import {DktanthudvhcService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthudvhc.service";
import {DkthamdochuyennhuongService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkthamdochuyennhuong.service";
import {DkkhaithacchuyennhuongService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacchuyennhuong.service";
import { DkDauGiaKhoangSanService } from './dangkydaugia/dangkydaugia.service';
import { DKPheDuyetTruLuongKhoangSanService } from './dangkypheduyettruluong/dkpheduyettruluongks.service';


@Injectable({
  providedIn: "root",
})

export class DangKyHoatDongKhoangSanFacadeService {
  constructor(private httpClient: HttpClient) {
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoKhoangSanService() {
    return new DkThamDoKhoangSanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoGiaHanService() {
    return new DkThamDoGiaHanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoDvhcService() {
    return new DkThamDoDvhcService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyThamDoLoaiKhoangSanService() {
    return new DkThamDoLoaiKhoangSanService(this.httpClient);
  }
  public getDangKyDauGiaKSService(){
    return new DkDauGiaKhoangSanService(this.httpClient);
  }
  public getDangKyPheDuyetTruLuongKSService(){
    return new DKPheDuyetTruLuongKhoangSanService(this.httpClient);
  }
  // Đăng ký thăm dò service
  public getDangKyThamDoCongTrinhService() {
    return new DkThamDoCongTrinhService(this.httpClient);
  }

  // Đăng ký khai thác cát sỏi service
  public getDangKyKhaiThacCatSoiService() {
    return new DkkhaithaccatsoiService(this.httpClient);
  }

  // Đăng ký khai thác điều chỉnh service
  public getDangKyKhaiThacDieuChinhService() {
    return new DkkhaithacdieuchinhService(this.httpClient);
  }

  // Đăng ký khai thác gia hạn service
  public getDangKyKhaiThacGiaHanService() {
    return new DkkhaithacgiahanService(this.httpClient);
  }

  // Đăng ký khai thác khoáng sản service
  public getDangKyKhaiThacKhoangSanService() {
    return new DkkhaithackhoangsanService(this.httpClient);
  }

  // Đăng ký khai thác khoáng sản dự án service
  public getDangKyKhaiThacKhoangSanDuAnService() {
    return new DkkhaithackhoangsanduanService(this.httpClient);
  }

  // Đăng ký khai thác vật liệu xây dựng service
  public getDangkyKhaiThacVLXDService() {
    return new DkkhaithacvlxdService(this.httpClient);
  }

  // Đăng ký thăm dò khu vực service
  public getDangKyThamDoKhuVucService() {
    return new DkthamdokhuvucService(this.httpClient);
  }

  // Đăng ký khai thác dvhc service
  public getDangKyKhaiThacDvhcService() {
    return new DkKhaiThacDvhcService(this.httpClient);
  }

  // Đăng ký khai thác service
  public getDangKyKhaiThacLoaiKhoangSanService() {
    return new DkkhaithacloaikhoangsanService(this.httpClient);
  }

  // Đăng ký thăm dò service
  public getDangKyKhaiThacCongTrinhService() {
    return new DkKhaiThacCongTrinhService(this.httpClient);
  }

  // Đăng ký thăm dò tọa độ khu vực service
  public getDangKyThamDoToaDoKhuVucService() {
    return new DkthamdotoadokhuvucService(this.httpClient);
  }

  public getDangKyTanThuKhoangSanService() {
    return new DktanthukhoangsanService(this.httpClient);
  }

  public getDangKyTanThuGiaHanService() {
    return new DktanthugiahanService(this.httpClient);
  }

  // Đăng ký tận thu dvhc service
  public getDangKyTanThuDvhcService() {
    return new DktanthudvhcService(this.httpClient);
  }

  // Đăng ký tận thu service
  public getDangKyTanThuLoaiKhoangSanService() {
    return new DktanthuloaikhoangsanService(this.httpClient);
  }

  // Đăng ký tận thu khu vực service
  public getDangkyTanThuKhuVucService() {
    return new DktanthukhuvucService(this.httpClient);
  }

  // Đăng ký khai thác khu vực service
  public getDangkyKhaiThacKhuVucService() {
    return new DkkhaithackhuvucService(this.httpClient);
  }

  // Đăng ký khai thác thiết bị service
  public getDangKyKhaiThacThietBiService() {
    return new DkkhaithacthietbiService(this.httpClient);
  }


  // Đăng ký khai thác trả lại service
  public getDangKyKhaiThacTraLaiService() {
    return new DkkhaithactralaiService(this.httpClient);
  }

  // Đăng ký thăm dò trả lại service
  public getDangKyThamDoTraLaiService() {
    return new DkthamdotralaiService(this.httpClient);
  }

  // Đăng ký Tận thu trả lại service
  public getDangKyTanThuTraLaiService() {
    return new DktanthutralaiService(this.httpClient);

  }

  // Đăng ký đóng cửa mỏ
  public getDangKyDongCuaMoService() {
    return new DkdongcuamoService(this.httpClient);
  }

  // Đăng ký thăm dò chuyển nhượng service
  public getDangKyThamDoChuyenNhuongService() {
    return new DkthamdochuyennhuongService(this.httpClient);
  }

  // Đăng ký khai thác chuyển nhượng service
  public getDangKyKhaiThacChuyenNhuongService() {
    return new DkkhaithacchuyennhuongService(this.httpClient);
  }
}

