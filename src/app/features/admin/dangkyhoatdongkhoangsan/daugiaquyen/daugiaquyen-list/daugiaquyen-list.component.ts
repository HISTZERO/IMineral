import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {NhomLoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import { MenuDkDauGiaQuyen } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";

@Component({
  selector: 'app-daugiaquyen-list',
  templateUrl: './daugiaquyen-list.component.html',
  styleUrls: ['./daugiaquyen-list.component.scss']
})
export class DaugiaquyenListComponent implements OnInit {

  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuDkDauGiaQuyen;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.daugiaquyen.titleList;
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
