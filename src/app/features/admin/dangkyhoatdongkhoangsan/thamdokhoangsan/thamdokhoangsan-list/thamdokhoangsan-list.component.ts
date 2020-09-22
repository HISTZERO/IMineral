import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuThamDoKhoangSan } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";

@Component({
  selector: 'app-thamdokhoangsan-list',
  templateUrl: './thamdokhoangsan-list.component.html',
  styleUrls: ['./thamdokhoangsan-list.component.scss']
})
export class ThamdokhoangsanListComponent implements OnInit {
  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuThamDoKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thamdokhoangsan.titleList;
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
