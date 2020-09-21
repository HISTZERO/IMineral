import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {NhomLoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import { MenuDkTanThuKhoangSan } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";

@Component({
  selector: 'app-tanthukhoangsan-list',
  templateUrl: './tanthukhoangsan-list.component.html',
  styleUrls: ['./tanthukhoangsan-list.component.scss']
})
export class TanthukhoangsanListComponent implements OnInit {

  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuDkTanThuKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tanthukhoangsan.titleList;
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
