import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuDkKhaiThacKhoangSan } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";

@Component({
  selector: 'app-khaithackhoangsan-list',
  templateUrl: './khaithackhoangsan-list.component.html',
  styleUrls: ['./khaithackhoangsan-list.component.scss']
})
export class KhaithackhoangsanListComponent implements OnInit {

  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuDkKhaiThacKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.khaithackhoangsan.titleList;
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

}
