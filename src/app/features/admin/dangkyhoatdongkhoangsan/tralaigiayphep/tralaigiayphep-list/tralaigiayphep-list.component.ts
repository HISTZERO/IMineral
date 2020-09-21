import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {NhomLoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import {MenuDkTraLaiGiayPhep } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";

@Component({
  selector: 'app-tralaigiayphep-list',
  templateUrl: './tralaigiayphep-list.component.html',
  styleUrls: ['./tralaigiayphep-list.component.scss']
})
export class TralaigiayphepListComponent implements OnInit {

  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuDkTraLaiGiayPhep;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tralaigiayphep.titleList;
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
